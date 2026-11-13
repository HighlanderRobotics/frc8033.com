"""Convert a STEP assembly locally; requires cadquery-ocp in a Python environment.

Usage: python scripts/convert-step.py assembly.step [public/models/wisp.glb.gz]
The original CAD file is never uploaded. Normal website builds need no Python.
"""
import gzip
import hashlib
import json
from pathlib import Path
import struct
import sys

from OCP.BRepMesh import BRepMesh_IncrementalMesh
from OCP.IFSelect import IFSelect_RetDone
from OCP.Message import Message_ProgressRange
from OCP.RWGltf import RWGltf_CafWriter
from OCP.STEPCAFControl import STEPCAFControl_Reader
from OCP.TCollection import TCollection_ExtendedString, TCollection_AsciiString
from OCP.TColStd import TColStd_IndexedDataMapOfStringString
from OCP.TDF import TDF_LabelSequence
from OCP.TDocStd import TDocStd_Document
from OCP.XCAFDoc import XCAFDoc_DocumentTool

source = Path(sys.argv[1])
destination = Path(sys.argv[2] if len(sys.argv)>2 else 'public/models/wisp.glb.gz')
destination.parent.mkdir(parents=True, exist_ok=True)
cache = Path('.astro/cad-export')
cache.mkdir(parents=True, exist_ok=True)
raw_path = cache / 'wisp.glb'

print('Reading STEP assembly with native OpenCascade…', flush=True)
document = TDocStd_Document(TCollection_ExtendedString('Robot assembly'))
reader = STEPCAFControl_Reader()
reader.SetColorMode(True)
reader.SetNameMode(True)
if reader.ReadFile(str(source)) != IFSelect_RetDone:
    raise RuntimeError('STEP file could not be read')
if not reader.Transfer(document):
    raise RuntimeError('STEP assembly could not be transferred')
shape_tool = XCAFDoc_DocumentTool.ShapeTool_s(document.Main())
roots = TDF_LabelSequence()
shape_tool.GetFreeShapes(roots)
print(f'Meshing {roots.Length()} assembly root(s)…', flush=True)
for i in range(1, roots.Length()+1):
    shape = shape_tool.GetShape_s(roots.Value(i))
    # 0.8 mm chord tolerance and 0.35 rad angular tolerance preserve mechanism
    # detail while keeping the full assembly practical on mobile devices.
    mesher = BRepMesh_IncrementalMesh(shape, 0.8, False, 0.35, False)
    if not mesher.IsDone():
        raise RuntimeError('Assembly triangulation failed')
writer = RWGltf_CafWriter(TCollection_AsciiString(str(raw_path)), True)
writer.SetMergeFaces(True)
writer.SetSplitIndices16(True)
if not writer.Perform(document, TColStd_IndexedDataMapOfStringString(), Message_ProgressRange()):
    raise RuntimeError('glTF export failed')

raw = raw_path.read_bytes()
if raw[:4] != b'glTF':
    raise RuntimeError('Invalid GLB output')
json_length = struct.unpack_from('<I', raw, 12)[0]
gltf = json.loads(raw[20:20+json_length])
primitives = [p for m in gltf.get('meshes',[]) for p in m.get('primitives',[])]
triangles = sum(gltf['accessors'][p['indices']]['count']//3 if 'indices' in p else gltf['accessors'][p['attributes']['POSITION']]['count']//3 for p in primitives)
if triangles < 1000:
    raise RuntimeError('Export does not contain the expected full robot geometry')
compressed = gzip.compress(raw, compresslevel=9, mtime=0)
destination.write_bytes(compressed)
metadata = {
    'source': source.name,
    'sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
    'sourceBytes': source.stat().st_size,
    'meshes': len(gltf['meshes']),
    'nodes': len(gltf['nodes']),
    'triangles': triangles,
    'materials': len(gltf.get('materials',[])),
    'outputBytes': len(raw),
    'compressedBytes': len(compressed),
    'coordinateSystem': 'Assembly axes preserved; viewer uses Z-up, meters',
    'linearDeflectionMillimeters': 0.8,
    'angularDeflectionRadians': 0.35,
    'converter': 'OpenCascade via cadquery-ocp 7.9.3.1.1',
}
destination.with_name(destination.name.removesuffix('.glb.gz')+'.json').write_text(json.dumps(metadata,indent=2)+'\n')
print(json.dumps(metadata,indent=2), flush=True)

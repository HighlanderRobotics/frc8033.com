# Mobile menu changes must not move a tap target

The first browser suite exposed a mobile regression: opening About and then
tapping Outreach collapsed the whole navigation rather than opening Outreach.
The previous menu closed on focusout during pointerdown. Its inline panel then
disappeared and moved the next summary before pointerup, so the click could land
outside the header.

Keep a panel open while focus moves within the header. Opening another dropdown
closes the previous one, and leaving the header closes the menus. The navigation
browser test reproduced the old behavior in mobile Chromium and checks the
observable result of changing menus. The mobile button's accessible name must
also include its visible word "Menu" in both open and closed states.

The WebKit run exposed a second keyboard difference: its default tab behavior
skipped ordinary links. Giving the skip link an explicit `tabindex="0"` makes it
the first keyboard target in that mode as well. The test uses a real Tab and
Enter in each browser, rather than programmatically focusing the link.

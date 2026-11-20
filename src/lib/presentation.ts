import { load } from 'cheerio';
import { withBase, pageUrl, srcset } from './urls';
import { linkTitle } from './page-titles';
import robots from '../data/robots.json';

function prefixMarkup($: ReturnType<typeof load>) {
  $('a[href]').each((_, el) => {
    const title = linkTitle($(el).attr('href') || '');
    if (title) $(el).attr('title', title);
  });
  $('[href],[src],[poster],[action],[srcset],[style]').each((_, el) => {
    for (const attr of ['href', 'src', 'poster', 'action']) {
      const value = $(el).attr(attr);
      if (value) $(el).attr(attr, attr === 'href' ? pageUrl(value) : withBase(value));
    }
    const candidates = $(el).attr('srcset');
    if (candidates) $(el).attr('srcset', srcset(candidates));
    const style = $(el).attr('style');
    if (style) $(el).attr('style', style.replace(/url\((?:"([^"]+)"|'([^']+)'|([^)]*))\)/g, (_, a, b, c) => `url("${withBase((a || b || c).trim())}")`));
  });
  return $.html();
}

/** Normalize imported presentation markup without changing the archived evidence or CMS source. */
export function presentContent(html: string, route: string) {
  const $ = load(html, null, false);
  $('h1,h2,h3,h4').each((_, el) => {
    $(el).html(($(el).html() || '').replace(/-\s*<br\s*\/?\s*>\s*/gi, ''));
    $(el).find('br').replaceWith(' ');
  });
  $('p').filter((_, el) => !$(el).text().trim() && !$(el).find('img,iframe').length).remove();
  $('h1').slice(1).each((_, el) => { el.tagName = 'h2'; });
  // Reserve H3 for subsections within a named robot subsystem.
  $('.div-block-55 .w-richtext p').each((_, el) => {
    if ($(el).find('strong').length && $(el).text().trim() === $(el).find('strong').text().trim()) {
      $(el).replaceWith(`<h3>${$(el).text().trim()}</h3>`);
    }
  });
  $('iframe[src*="youtube.com"]').each((_, el) => {
    $(el).attr('src', ($(el).attr('src') || '').replace('www.youtube.com/', 'www.youtube-nocookie.com/'))
      .attr('referrerpolicy', 'strict-origin-when-cross-origin')
      .attr('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share')
      .attr('loading', 'lazy');
  });
  if (route === '/') {
    $('.section-6').addClass('paddo-feature').attr('id', 'paddo');
    $('.section-6 .heading-3').text('Meet Paddo the Frog');
    $('.section-6 .text-block-2').replaceWith('<p class="paddo-description">Built from the ground up for the 2023 season, Paddo took Team 8033 to the FIRST® World Championship in Houston.</p>');
    $('.section-6 .w-button').text('Meet Paddo');
    $('.section-6 .column-2').append('<a class="video-fallback" href="https://www.youtube.com/watch?v=hk5MFO64Qcs" target="_blank" rel="noopener noreferrer">Watch Paddo’s reveal on YouTube <span aria-hidden="true">↗</span></a>');
  }
  const sponsors = $('.sponsors.largest').attr('id', 'sponsors');
  if (route === '/') {
    // The original homepage layout sizes logos as direct children of each row.
    sponsors.closest('.body-section').addClass('homepage-sponsors');
  } else {
    $('.sponsors img').each((_, el) => {
      $(el).wrap('<div class="sponsor-logo"></div>');
    });
  }
  if (route === '/our-members') {
    $('h1').each((_, el) => { el.tagName = 'h2'; });
    $.root().prepend('<h1 class="page-heading">Student Leadership</h1>');
  }
  if (route === '/meet-the-team') {
    $('.heading-54').last().text('Our Student Executives');
    $('.button-14').each((i, el) => $(el).text(i === 0 ? 'Meet Our Mentors' : 'Meet Student Leaders'));
  }
  // A navigation-looking placeholder should never lead to the top of the page.
  if (route === '/robots/nessie') $('a.w-button[href="#"]').attr('href', 'https://www.youtube.com/watch?v=crw8_wNS1BM').attr('target','_blank').attr('rel','noopener noreferrer');
  if (route === '/robots/whirlpool') $('a.w-button[href="#"]').replaceWith('<p class="video-unavailable">Robot video not available.</p>');
  if (route === '/robots/selkie') {
    $('.div-block-21').remove();
    $('.section-11').first().append('<img class="selkie-photo" src="/assets/175aa4465c4af51c-65c908a04e251835b4cff494_Selkie.jpg" alt="Selkie, the 2022 Highlander Robotics robot" width="1000" loading="eager">');
  }
  if (route.startsWith('/robots/') && route !== '/robots/overview') $.root().children().last().addClass('robot-finale');
  if (route.startsWith('/robots/') && route !== '/robots/overview') {
    const robot = robots.find(robot => robot.route === route);
    if (robot) {
      $.root().prepend('<nav class="page-breadcrumb" aria-label="Breadcrumb"><a href="/robots/overview">← All Robots</a></nav>');
      if (!$('.div-block-39').length) $('h1').first().after(`<div class="robot-season-intro"><p class="eyebrow">${robot.year} · ${robot.game}</p><p>${robot.summary}</p></div>`);
      if (route === '/robots/paddo') {
        const introduction = $('.div-block-39 p').first();
        introduction.after(`<details class="robot-game-details"><summary>About the ${robot.year} game</summary><p>${introduction.html()}</p></details>`);
        introduction.text(robot.summary);
      }
    }
    $('.div-block-55 img').each((_, el) => {
      const heading = $(el).parent().find('h2').first().text();
      if (!$(el).attr('alt')) $(el).attr('alt', `${$('h1').first().text()} — ${heading}`);
      $(el).attr('sizes', '(max-width: 767px) calc(100vw - 84px), 380px');
    });
  }
  if (route.startsWith('/outreach/') && route !== '/outreach/overview') $.root().prepend('<nav class="page-breadcrumb" aria-label="Breadcrumb"><a href="/outreach/overview">← All Outreach Seasons</a></nav>');
  if (route === '/outreach/2019') {
    // The original retains its EXIF orientation; Webflow's resized copies do not.
    $('.award-block').filter((_, el) => $(el).find('h2').text().trim() === 'Open House').attr('id', 'open-house').find('img')
      .removeAttr('srcset').removeAttr('sizes')
      .attr('alt', 'Highlander Robotics founders demonstrating their robot at the February 2020 Open House');
  }
  // Remove layout line breaks from prose while retaining explicit lists and sections.
  $('.migration-faq .w-dropdown-list').find('br').replaceWith(' ');
  $('.migration-faq summary .w-icon-dropdown-toggle').remove();
  $('.migration-faq summary').append('<span class="faq-symbol" aria-hidden="true"></span>');
  return prefixMarkup($);
}

export function presentFooter(html: string, route: string) {
  const $ = load(html, null, false);
  $('a[aria-current]').removeAttr('aria-current').removeClass('w--current');
  $(`a[href="${route}"]`).attr('aria-current', 'page');
  $('.footer-brand img').attr('alt', '8033 Highlander Robotics');
  $('.footer-social-link').each((_, el) => {
    const href = $(el).attr('href') || '';
    $(el).attr('aria-label', href.includes('youtube') ? 'YouTube' : href.includes('instagram') ? 'Instagram' : 'GitHub');
  });
  $('.footer-dark').get(0)!.tagName = 'footer';
  return prefixMarkup($);
}

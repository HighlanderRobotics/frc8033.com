import { load } from 'cheerio';

/** Normalize imported presentation markup without changing the archived evidence or CMS source. */
export function presentContent(html: string, route: string) {
  const $ = load(html, null, false);
  $('h1,h2,h3,h4').each((_, el) => {
    $(el).html(($(el).html() || '').replace(/-\s*<br\s*\/?\s*>\s*/gi, ''));
    $(el).find('br').replaceWith(' ');
  });
  $('p').filter((_, el) => !$(el).text().trim() && !$(el).find('img,iframe').length).remove();
  $('h1').slice(1).each((_, el) => { el.tagName = 'h2'; });
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
  // Remove layout line breaks from prose while retaining explicit lists and sections.
  $('.migration-faq .w-dropdown-list').find('br').replaceWith(' ');
  $('.migration-faq summary .w-icon-dropdown-toggle').remove();
  $('.migration-faq summary').append('<span class="faq-symbol" aria-hidden="true"></span>');
  if (route === '/contact') {
    $('form').attr('data-contact-form', '');
    $('input[type="submit"]').attr('value', 'Open Email App');
    $('input[name="name"]').attr('autocomplete', 'name');
    $('input[type="email"]').attr('autocomplete', 'email');
    $('.w-form-done,.w-form-fail').remove();
  }
  return $.html();
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
  return $.html();
}

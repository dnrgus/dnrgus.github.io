// Progressive enhancement only. Without JavaScript every page still reads and links correctly.
(function () {
  'use strict'

  var story = document.querySelector('.story')
  if (story) initStory(story)

  var list = document.querySelector('.archive-list')
  if (list) initArchiveSearch(list)

  initBackToTop()
  initReveal()

  function initReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!('IntersectionObserver' in window)) return
    var items = document.querySelectorAll('.category-list > li, .writing-list > li')
    if (!items.length) return
    document.documentElement.classList.add('js-motion')
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in')
          io.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15 })
    Array.prototype.forEach.call(items, function (li, i) {
      var isCategory = li.parentNode.classList.contains('category-list')
      li.classList.add('reveal', isCategory ? 'pop' : 'slice')
      li.style.setProperty('--d', (i % 6) * 90 + 'ms')
      io.observe(li)
    })
  }

  function initStory(article) {
    var bar = document.createElement('div')
    bar.className = 'read-progress'
    bar.setAttribute('aria-hidden', 'true')
    document.body.appendChild(bar)

    var body = article.querySelector('.story-body')
    var meta = article.querySelector('.story-meta')
    if (meta && body) {
      var chars = body.textContent.replace(/\s+/g, '').length
      var minutes = Math.max(1, Math.round(chars / 550))
      var sep = document.createElement('span')
      sep.setAttribute('aria-hidden', 'true')
      sep.textContent = '/'
      var time = document.createElement('span')
      time.textContent = '약 ' + minutes + '분'
      meta.appendChild(sep)
      meta.appendChild(time)
    }

    var heads = article.querySelectorAll('.story-section h2')
    if (heads.length >= 2) {
      var toc = document.createElement('nav')
      toc.className = 'toc'
      toc.setAttribute('aria-label', '본문 목차')
      var title = document.createElement('p')
      title.className = 'toc-title'
      title.textContent = '목차'
      var ol = document.createElement('ol')
      Array.prototype.forEach.call(heads, function (h, i) {
        if (!h.id) h.id = 'section-' + (i + 1)
        var li = document.createElement('li')
        var a = document.createElement('a')
        a.href = '#' + h.id
        a.textContent = h.textContent
        li.appendChild(a)
        ol.appendChild(li)
      })
      toc.appendChild(title)
      toc.appendChild(ol)
      var header = article.querySelector('.story-header')
      if (header && header.nextSibling) header.parentNode.insertBefore(toc, header.nextSibling)
    }

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    var ticking = false
    function updateProgress() {
      var max = document.documentElement.scrollHeight - window.innerHeight
      var ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0
      bar.style.transform = 'scaleX(' + ratio.toFixed(4) + ')'
      ticking = false
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(updateProgress)
      }
    }, { passive: true })
    updateProgress()
    if (reduce) bar.style.transition = 'none'
  }

  function initArchiveSearch(list) {
    var tools = document.querySelector('.archive-tools')
    var input = document.getElementById('archive-search')
    var count = document.querySelector('.archive-count')
    if (!tools || !input) return
    tools.hidden = false

    var items = Array.prototype.slice.call(list.querySelectorAll(':scope > li'))
    var empty = document.createElement('li')
    empty.className = 'archive-empty'
    empty.textContent = '검색 결과가 없습니다.'
    empty.hidden = true
    list.appendChild(empty)

    function apply() {
      var terms = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
      var shown = 0
      items.forEach(function (li) {
        var text = li.textContent.toLowerCase()
        var match = terms.every(function (t) { return text.indexOf(t) !== -1 })
        li.hidden = !match
        if (match) shown++
      })
      empty.hidden = shown !== 0
      if (count) count.textContent = terms.length ? shown + '편 검색됨 (전체 ' + items.length + '편)' : '전체 ' + items.length + '편'
    }
    input.addEventListener('input', apply)
    apply()
  }

  function initBackToTop() {
    var button = document.createElement('button')
    button.type = 'button'
    button.className = 'to-top'
    button.textContent = '맨 위로'
    button.setAttribute('aria-label', '페이지 맨 위로 이동')
    document.body.appendChild(button)
    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    })
    window.addEventListener('scroll', function () {
      button.classList.toggle('is-visible', window.scrollY > 600)
    }, { passive: true })
  }
})()

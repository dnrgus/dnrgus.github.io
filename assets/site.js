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
        li.style.setProperty('--i', i)
        li.appendChild(a)
        ol.appendChild(li)
      })
      toc.appendChild(title)
      toc.appendChild(ol)
      var header = article.querySelector('.story-header')
      if (header && header.nextSibling) header.parentNode.insertBefore(toc, header.nextSibling)
      initTocSpring(toc)
      if ('IntersectionObserver' in window) {
        var links = toc.querySelectorAll('a')
        var linkFor = {}
        Array.prototype.forEach.call(links, function (a) { linkFor[a.getAttribute('href').slice(1)] = a })
        var spy = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return
            Array.prototype.forEach.call(links, function (a) { a.classList.remove('is-current') })
            var current = linkFor[entry.target.id]
            if (current) current.classList.add('is-current')
          })
        }, { rootMargin: '-40% 0px -55% 0px' })
        Array.prototype.forEach.call(heads, function (h) { spy.observe(h) })
      }
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

  // The side table of contents lags behind scrolling and springs back up/down.
  function initTocSpring(toc) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    var y = 0
    var v = 0
    var last = window.scrollY
    var running = false
    var K = 0.035
    var C = 0.2
    function wide() { return window.matchMedia('(min-width: 1280px)').matches }
    // Place the table of contents, but never let its top edge rise above the article title.
    function place(offset) {
      if (!wide()) { toc.style.display = ""; toc.style.transform = ""; return }
      var body = document.querySelector(".story-body")
      // Hide the side table of contents when there is no room for it beside the article.
      if (body && body.getBoundingClientRect().left < 240) { toc.style.display = "none"; return }
      toc.style.display = ""
      var h = toc.offsetHeight
      var base = window.innerHeight / 2 - h / 2
      var title = document.querySelector('.story-header h1')
      var floor = title ? title.getBoundingClientRect().top - base : -Infinity
      var room = Math.max(0, (window.innerHeight - h) / 2 - 12)
      var limit = Math.min(60, room)
      var value = Math.max(-limit, Math.min(limit, offset))
      value = Math.max(value, floor)
      toc.style.transform = 'translateY(calc(-50% + ' + value.toFixed(2) + 'px))'
    }
    function frame() {
      v += -K * y - C * v
      // Keep the table of contents inside the viewport even when it is long.
      var room = Math.max(0, (window.innerHeight - toc.offsetHeight) / 2 - 12)
      var limit = Math.min(60, room)
      y = Math.max(-limit, Math.min(limit, y + v))
      if (wide()) place(y)
      if (Math.abs(y) > 0.05 || Math.abs(v) > 0.05) {
        window.requestAnimationFrame(frame)
      } else {
        running = false
        y = 0
        v = 0
        if (wide()) place(0)
      }
    }
    window.addEventListener('scroll', function () {
      if (!wide()) return
      var d = window.scrollY - last
      last = window.scrollY
      v += Math.max(-40, Math.min(40, d)) * 0.18
      if (!running) {
        running = true
        window.requestAnimationFrame(frame)
      }
    }, { passive: true })
    if (wide()) place(0)
    window.addEventListener("resize", function () { place(0) })
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

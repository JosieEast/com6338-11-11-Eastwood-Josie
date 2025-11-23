const getPoemBtn = document.getElementById('get-poem')
const poemEl = document.getElementById('poem')
const poemURL =
  'https://poetrydb.org/random,linecount/1;12/author,title,lines.json'

const getJSON = url => fetch(url).then(res => res.json())

const pipe = (...fns) => firstArg =>
  fns.reduce((returnValue, fn) => fn(returnValue), firstArg)

const makeTag = tag => str => `<${tag}>${str}</${tag}>`

// build the poem HTML string from the API JSON
const makePoemHTML = poemJSON => {
  const poem = poemJSON[0] // API returns an array with one poem

  // tag helpers
  const makeH2 = makeTag('h2')
  const makeH3 = makeTag('h3')
  const makeEm = makeTag('em')
  const makeP = makeTag('p')

  // split lines into stanza arrays ("" = stanza break)
  const stanzas = poem.lines
    .reduce(
      (all, line) => {
        if (line === '') {
          // start new stanza
          all.push([])
        } else {
          all[all.length - 1].push(line)
        }
        return all
      },
      [[]]
    )
    .filter(stanza => stanza.length > 0)

  // stanza array -> HTML string of <p>...</p> blocks
  const stanzasHTML = stanzas
    .map(stanza =>
      makeP(
        stanza
          .map((line, i) =>
            i === stanza.length - 1 ? line : `${line}<br>`
          )
          .join('')
      )
    )
    .join('')

  const titleHTML = makeH2(poem.title)
  const authorHTML = makeH3(makeEm(`by ${poem.author}`))

  // use pipe at least once to assemble full HTML
  const assemble = pipe(parts => parts.join(''))

  return assemble([titleHTML, authorHTML, stanzasHTML])
}

// attach a click event to #get-poem
getPoemBtn.onclick = async function () {
  // clear previous poem, then render new one
  poemEl.innerHTML = makePoemHTML(await getJSON(poemURL))
}

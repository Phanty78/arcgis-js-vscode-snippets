// Function to load correctly json files
async function loadJsonFile(filePath) {
  try {
    const response = await fetch(filePath)
    if (!response.ok) {
      throw new Error(
        `Failed to load snippets: HTTP status ${response.status} (${response.statusText})`
      )
    }
    const file = await response.json()
    return file
  } catch (error) {
    console.error('Error loading snippets:', error)
  }
}

// Init Function
async function init() {
  const [
    htmlJson,
    javascriptJson,
    JsonJson,
    typescriptJson,
    typescriptreactJson,
  ] = await Promise.all([
    loadJsonFile('./snippets/html.json'),
    loadJsonFile('./snippets/javascript.json'),
    loadJsonFile('./snippets/json.json'),
    loadJsonFile('./snippets/typescript.json'),
    loadJsonFile('./snippets/typescriptreact.json'),
  ])

  const languageSelect = document.getElementById('language-select')
  let file
  const allLanguages = [
    { value: '', label: 'Select a language' },
    { value: 'htmlJson', label: 'HTML' },
    { value: 'javascriptJson', label: 'JavaScript' },
    { value: 'JsonJson', label: 'JSON' },
    { value: 'typescriptJson', label: 'TypeScript' },
    { value: 'typescriptreactJson', label: 'TypeScript React' },
  ]
  for (let i = 0; i < allLanguages.length; i++) {
    const option = document.createElement('option')
    option.setAttribute('value', allLanguages[i].value)
    if (!allLanguages[i].value) {
      option.setAttribute('selected', true)
      option.setAttribute('disabled', true)
    }
    option.innerHTML = allLanguages[i].label
    languageSelect.appendChild(option)
  }

  const generalSelector = document.getElementById('general-snippets-selector')
  const getFileBylanguageSelect = (languageSelected) => {
    const files = {
      htmlJson: htmlJson,
      javascriptJson: javascriptJson,
      jsonJson: JsonJson,
      typescriptJson: typescriptJson,
      typescriptreactJson: typescriptreactJson,
    }
    return files[languageSelected]
  }

  const createOptionsSelectSnippet = (keyFiles) => {
    keyFiles.forEach((element) => {
      const option = document.createElement('option')
      option.setAttribute('value', element)
      option.innerHTML = element
      generalSelector.appendChild(option)
    })
  }
  const outputContainer = document.getElementById('output')
  const outputElementBody = document.getElementById('output-body')
  const outputElementDescription = document.getElementById('output-description')
  const outputElementPrefix = document.getElementById('output-prefix')

  const createBody = (body) => {
    outputElementBody.innerHTML = ''
    body.forEach((element) => {
      const span = document.createElement('span')
      span.innerText = element
      outputElementBody.appendChild(span)
    })
  }
  const onChangeGeneralSelector = (selectedValue) => {
    const selectedData = file[selectedValue]

    outputElementPrefix.textContent = `${
      Array.isArray(selectedData.prefix)
        ? selectedData.prefix[0]
        : selectedData.prefix
    }`
    createBody(selectedData.body)
    outputElementDescription.textContent = `${selectedData.description}`
  }
  const onChangelanguageSelect = (e) => {
    generalSelector.innerHTML = ''

    const languageSelected = e.target.value
    file = getFileBylanguageSelect(languageSelected)
    const keyfiles = Object.keys(file)
    createOptionsSelectSnippet(keyfiles)
    onChangeGeneralSelector(keyfiles[0])
    outputContainer.setAttribute('class', 'output')
  }

  languageSelect.addEventListener('change', onChangelanguageSelect)
  generalSelector.addEventListener('change', (e) =>
    onChangeGeneralSelector(e.target.value)
  )
}

document.addEventListener('DOMContentLoaded', init)

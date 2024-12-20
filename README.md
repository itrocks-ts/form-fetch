[![npm version](https://img.shields.io/npm/v/@itrocks/form-fetch?logo=npm)](https://www.npmjs.org/package/@itrocks/form-fetch)
[![npm downloads](https://img.shields.io/npm/dm/@itrocks/form-fetch)](https://www.npmjs.org/package/@itrocks/form-fetch)
[![GitHub](https://img.shields.io/github/last-commit/itrocks-ts/form-fetch?color=2dba4e&label=commit&logo=github)](https://github.com/itrocks-ts/form-fetch)
[![issues](https://img.shields.io/github/issues/itrocks-ts/form-fetch)](https://github.com/itrocks-ts/form-fetch/issues)
[![discord](https://img.shields.io/discord/1314141024020467782?color=7289da&label=discord&logo=discord&logoColor=white)](https://25.re/ditr)

# form-fetch

AJAX fetch for HTML form submissions using form DOM data.

## Installation

```bash
npm install form-fetch
```

## Usage

With an HTML page containing a **button**, a **form**, and a **div** with id **result**,
you can [fetch](https://developer.mozilla.org/docs/Web/API/Window/fetch) your form when clicking the button:

```ts
import formFetch from './node_modules/@itrocks/form-fetch/form-fetch.js'

document.querySelector('button').addEventListener('click', async () => 
{
	const htmlResponse = await formFetch(document.querySelector('form')).text()
	document.getElementById('#result').innerHTML = htmlResponse
})
```

Alternatively, add a submit event listener to the form
to trigger a [fetch](https://developer.mozilla.org/docs/Web/API/Window/fetch) instead of a standard submission:

```ts
import { formFetchOnSubmit } from './node_modules/@itrocks/form-fetch/form-fetch.js'

document.addEventListener('load', () => {
	formFetchOnSubmit(document.querySelector('form'), response => {
		document.getElementById('#result').innerHTML = htmlResponse
  })
})
```

For a streamlined approach, use [xtarget](https://www.npmjs.org/package/@itrocks/xtarget)
and [build](https://www.npmjs.org/package/@itrocks/build) to automate `form-fetch`:

```ts
import { buildXTarget } from './node_modules/@itrocks/xtarget/xtarget.js'
buildXTarget()
```

## Features

[form](https://developer.mozilla.org/docs/Web/HTML/Element/form) attributes
automatically set [fetch()](https://developer.mozilla.org/docs/Web/API/Window/fetch) options:

- [action](https://developer.mozilla.org/docs/Web/HTML/Element/form#action)
  => [fetch resource](https://developer.mozilla.org/docs/Web/API/Window/fetch#resource)
- [form data](https://developer.mozilla.org/docs/Web/HTML/Element/form)
  => [request body](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#body)
- [enctype](https://developer.mozilla.org/docs/Web/HTML/Element/form#enctype)
  => body encoding as [FormData](https://developer.mozilla.org/docs/Web/API/FormData)
  or [URLSearchParams](https://developer.mozilla.org/docs/Web/API/URLSearchParams)
- [method](https://developer.mozilla.org/docs/Web/HTML/Element/form#method)
  => [request method](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#method) 

You can override these options with custom values for [action](#formFetch)
and [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit).

## API

### FormElement

A type alias for form submitter elements:

```ts
type FormElement = HTMLButtonElement | HTMLFormElement | HTMLInputElement
```

### formFetch()

Submits a form using [fetch()](https://developer.mozilla.org/docs/Web/API/Window/fetch),
based on form DOM data.

```ts
response = formFetch(form)
response = formFetch(form, action)
response = formFetch(form, action, init)
```

#### Parameters

- **form:**
  An [HTMLFormElement](https://developer.mozilla.org/docs/Web/API/HTMLFormElement)
  to submit with [fetch()](https://developer.mozilla.org/docs/Web/API/Window/fetch).
- **action:**
  Optional [resource URL](https://developer.mozilla.org/docs/Web/API/Window/fetch#resource).
  Defaults to form's [action attribute](https://developer.mozilla.org/docs/Web/HTML/Element/form#action).
- **init:**
  A [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit) object
  for custom request settings.
- returned **response:**
  A [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  that resolves to a [Response](https://developer.mozilla.org/docs/Web/API/Response) object,
  as returned by the call to [fetch()](https://developer.mozilla.org/docs/Web/API/Window/fetch).

#### Example

```ts
document.querySelectorAll('form').forEach(form => {
	formFetch(form)
		.then(response => response.text())
		.then(html => document.getElementById('#result').append(html))
})
```

### formFetchOnSubmit()

Attaches a [submit](https://developer.mozilla.org/docs/Web/API/HTMLFormElement/submit_event)
[event listener](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)
to [fetch](https://developer.mozilla.org/docs/Web/API/Window/fetch) instead of submit.

```ts
formFetchSubmit(element, setResponse)
formFetchSubmit(element, setResponse, init)
```

#### Parameters

- **element:**
  A [FormElement](#FormElement) (form, button, or input).
- **setResponse:**
  A callback handling the [Response](https://developer.mozilla.org/docs/Web/API/Response):
  ```ts
  setResponse(response, targetSelector, form)
  ```
  - **response:**
    The retrieved [Response](https://developer.mozilla.org/docs/Web/API/Response).
  - **targetSelector:**
    The selector for the target where the form response should be displayed,
    determined by the [formtarget](https://developer.mozilla.org/docs/Web/HTML/Element/input#formtarget) of the submitter
    or the [target](https://developer.mozilla.org/docs/Web/HTML/Element/form#target) of the form.
  - **form:**
    The submitted [HTMLFormElement](https://developer.mozilla.org/docs/Web/API/HTMLFormElement).
    <br/><br/>
- **init:**
  A callback that returns a [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit) object
  containing any custom settings to apply to the request.

### formMethod()

Determines the effective [method](https://developer.mozilla.org/docs/Web/HTML/Element/form#method)
for [fetch()](https://developer.mozilla.org/docs/Web/API/Window/fetch) submit.

```ts
method = formMethod(form)
method = formMethod(form, init)
```

#### Parameters

- **form:**
  A [HTMLFormElement](https://developer.mozilla.org/docs/Web/API/HTMLFormElement).
- **init:**
  An optional [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit) object.
  If [init.method](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#method) is set, it is returned.
- returned **method:**
  The return value is the calculated HTTP method, determined by the following priority of non-empty values:
  - The value of [init.method](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#method),
  - The `data-method` attribute value of the [form](https://developer.mozilla.org/docs/Web/HTML/Element/form),
  - The value of the [form's method attribute](https://developer.mozilla.org/docs/Web/HTML/Element/form#method). 

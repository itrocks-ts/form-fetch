
export type FormElement = HTMLButtonElement | HTMLFormElement | HTMLInputElement

export function formFetch(form: HTMLFormElement, action?: string, init: RequestInit = {})
{
	const formData = new FormData(form)
	const url      = new URL(action ?? form.action)

	init.method = formMethod(form, init)
	if (init.method.toLowerCase() === 'post') {
		init.body = (form.enctype.toLowerCase() === 'multipart/form-data')
			? formData
			: new URLSearchParams(formData as any)
	}
	else {
		const formParams = new URLSearchParams(formData as any)
		const urlParams  = url.search.slice(1)
		url.search = (urlParams === '' ? '' : (urlParams.toString() + '&')) + formParams.toString()
	}

	return fetch(url, init)
}

export function formFetchOnSubmit(
	element:     FormElement,
	setResponse: (response: Response, targetSelector: string, form: HTMLFormElement) => void,
	init?:       (element: HTMLElement) => RequestInit
) {
	const form = (element.form ?? element) as HTMLFormElement
	if (!form || form.formFetchOnSubmit) return
	form.formFetchOnSubmit = true
	form.addEventListener('submit', async event => {
		const submitter = event.submitter as (HTMLButtonElement | HTMLInputElement)
		event.preventDefault()
		const action   = submitter?.getAttribute('formaction') ? submitter?.formAction : undefined
		const response = await formFetch(form, action, (init && submitter) ? init(submitter) : undefined)
		setResponse(response, submitter?.formTarget || form.target, form)
	})
}

export function formMethod(form: HTMLFormElement, init: RequestInit = {})
{
	return init.method ??= form.dataset.method || form.method
}


export type FetchErrorCallback  = (error: any, href: string, target: string) => void
export type FormElement         = HTMLButtonElement | HTMLFormElement | HTMLInputElement
export type InitCallback        = (element: HTMLButtonElement | HTMLInputElement) => RequestInit
export type SetResponseCallback = (response: Response, targetSelector: string, form: HTMLFormElement) => void

export function formFetch(form: HTMLFormElement, action: string, init: RequestInit = {})
{
	const formData = new FormData(form)
	const url      = new URL(action)

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
	element: FormElement, setResponse: SetResponseCallback, init?: InitCallback, onError?: FetchErrorCallback
) {
	const form = (element.form ?? element) as HTMLFormElement
	if (!form || form.formFetchOnSubmit) return
	form.formFetchOnSubmit = true
	form.addEventListener('submit', async event => {
		const submitter = event.submitter as (HTMLButtonElement | HTMLInputElement | null)
		event.preventDefault()
		const action = (submitter?.getAttribute('formaction') ? submitter?.formAction : undefined) ?? form.action
		const target = submitter?.formTarget || form.target
		try {
			const response = await formFetch(form, action, (init && submitter) ? init(submitter) : undefined)
			setResponse(response, target, form)
		}
		catch (error) {
			onError?.(error, action, target)
		}
	})
}

export function formMethod(form: HTMLFormElement, init: RequestInit = {})
{
	return init.method ??= form.dataset.method || form.method
}

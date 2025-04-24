interface TranslateCardProps {
    "sentence": string,
    "translate": string
}

export const sendToServer = async (
    file: File,
    setResult: (value: TranslateCardProps | null) => void,
    setLoading: (value: boolean) => void
) => {
    const formData = new FormData();
    console.log(formData)
    formData.append('file', file, file.name);
    setResult(null);

    console.log(formData)

    try {
        const res = await fetch('/api/analyze_image', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
        const data = await res.json();
        setResult(data);
    } catch (err) {
        console.error(err);
        setResult({sentence: 'Error', translate: 'Error'});
    } finally {
        setLoading(false);
    }
};

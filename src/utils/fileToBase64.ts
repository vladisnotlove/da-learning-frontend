const toBase64 = (file: File) => new Promise<string | null>((resolve, reject) => {
	const reader = new FileReader();
	reader.readAsDataURL(file);
	// @ts-ignore
	reader.onload = () => resolve(reader.result);
	reader.onerror = error => reject(error);
});

export default toBase64;

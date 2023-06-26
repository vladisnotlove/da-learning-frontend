import {useMutation} from "react-query";
import ImageModel from "Api/media/models/ImageModel";
import {handleApiCatch, TApiErrors} from "Api/@core/errors";
import {postFormData} from "Api/@core/methods";
import urls from "Api/urls";

type TUploadImageBody = {
	image: File
};
type TUploadImageResponse = ImageModel;
type TUploadImageErrors = TApiErrors<keyof ImageModel>;

const useUploadImage = () => {
	return useMutation<TUploadImageResponse, TUploadImageErrors, TUploadImageBody>(variables => {
		return postFormData<TUploadImageResponse>(urls.mediaImages(), variables)
			.then(value => {
				return value.data;
			})
			.catch(handleApiCatch);
	});
};

export default useUploadImage;

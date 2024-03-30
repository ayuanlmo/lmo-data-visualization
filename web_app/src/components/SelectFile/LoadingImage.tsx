import React, {useState} from "react";
import Loading from "@hi-ui/loading";

interface ILoadingImageProps {
    src: string;
    alt?: string;
    className?: string;
}

const LoadingImage = (props: ILoadingImageProps): React.JSX.Element => {
    const {src, alt, className} = props;
    const [loading, setLoading]:
        [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(true);

    return (
        <Loading visible={loading}>
            <img
                className={className}
                onLoad={(): void => setLoading(false)}
                src={src} alt={alt}
            />
        </Loading>
    );
};

export default LoadingImage;
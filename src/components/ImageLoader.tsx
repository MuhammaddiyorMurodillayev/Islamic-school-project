import { useEffect, useState } from "react";
import { supabase } from "../subabaseClient";

interface ImageLoaderProps {
    imageId?: string,
    style?: string,
    url?: string
}

function ImageLoader({ imageId, style, url }: ImageLoaderProps) {

    const [previewUrl, setPreviewUrl] = useState<string>('');

    if (url && url.trim() !== '') {
        return (
            <img
                src={url}
                alt="Current"
                className={style}
            />
        )
    }


    useEffect(() => {
        const fetchImageFromDB = async () => {
            const { data, error } = await supabase
                .from("images")
                .select(`
                    id,
                    alt(
                        en,
                        ru,
                        uz
                    ),
                    category(
                        en,
                        ru,
                        uz
                    ),
                    url
                `)
                .eq("id", imageId)
                .single();

            if (error || !data) {
                console.error("❌ Error fetching image:", error?.message);
                return;
            }

            setPreviewUrl(data.url);
        };

        fetchImageFromDB();
    }, []);

    return (
        <img
            src={previewUrl}
            alt="Current"
            className={style}
        />
    )
}

export default ImageLoader
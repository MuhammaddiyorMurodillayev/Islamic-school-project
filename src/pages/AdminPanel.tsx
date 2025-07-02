
import ImageChanger from "../components/ImageChanger";

function AdminPanel() {

    const images = [
        {
            id: 'bf61e4fe-0d76-420f-8666-b419e02f6564',
            name: 'logo',
        },
        {
            id: 'bf61e4fe-0d76-420f-8666-b419e02f6564',
            name: 'logo',
        },
        {
            id: 'bf61e4fe-0d76-420f-8666-b419e02f6564',
            name: 'logo',
        },
        {
            id: 'bf61e4fe-0d76-420f-8666-b419e02f6564',
            name: 'logo',
        },
    ]


    return (
        <div className="grid grid-flow-row m-20">
            {images.map(image => {
                return (
                    <div className="flex flex-col">
                        <h1>{image.name}</h1>
                        <ImageChanger imageId={image.id} />
                    </div>
                )
            })}
        </div>
    );
}

export default AdminPanel;

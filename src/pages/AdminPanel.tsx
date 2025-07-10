
import ImageChanger from "../components/ImageChanger";
import TuitionTableEditable from "../components/TuitionTableEditable";
import ImageUploader from "../components/ImageUploader";
import { useEffect, useState } from "react";
import { supabase } from "../subabaseClient";
import TuitionFee from "../components/TuitionFee";
import _ from "lodash";
import AdminLogin from "../components/AdminLogin";
import ChangePhoneAndEmail from "../components/ChangePhoneAndEmail";
import ChangeWorkHours from "../components/ChangeWorkHours";

function AdminPanel() {


    const [isAdmin, setAdmin] = useState<boolean>(true);

    const [trigger, setTrigger] = useState<number>(0);
    const [trigger2, setTrigger2] = useState<number>(50);
    const [trigger3, setTrigger3] = useState<number>(100);

    const [images, setImages] = useState([{
        id: '',
        name: '',
    }])

    // console.log(trigger,trigger2,trigger3);



    useEffect(() => {
        const loadAllImages = async () => {

            const { data, error } = await supabase.from('images').select(`id, filename`);

            if (error) {
                console.log('rasnlar toplimadi');
                return;
            }

            setImages(data.map(e => {
                return ({
                    id: e.id,
                    name: e.filename,
                })
            }))
        }
        loadAllImages();
    }, [])



    useEffect(() => {
        const adminStatus = localStorage.getItem("isAdmin");
        const adminTime = localStorage.getItem("adminTime");

        if (adminStatus === "true" && adminTime) {
            const now = Date.now();
            const loginTime = parseInt(adminTime);

            if (now - loginTime < 5 * 60 * 1000) {
                setAdmin(true);
            } else {
                localStorage.removeItem("isAdmin");
                localStorage.removeItem("adminTime");
                setAdmin(false);
            }
        }
    }, []);

    useEffect(() => {
        if (isAdmin) {
            localStorage.setItem("isAdmin", "true");
            localStorage.setItem("adminTime", Date.now().toString());
        }
    }, [isAdmin]);

    if (!isAdmin) {
        return <AdminLogin setAdmin={setAdmin} />;
    }

    return (
        <div className="w-full">

            <div className="m-10">
                <hr className=" bg-gray-300 shadow h-0.5" />
            </div>

            {/*Logo Change */}
            <div className="flex flex-col gap-5 text-start mt-5 mx-20">
                <h1 className="text-center text-4xl mb-4">Logo Change</h1>
                <div className="flex justify-center items-center">
                    <ImageChanger imageId="bf61e4fe-0d76-420f-8666-b419e02f6564" />
                </div>
            </div>

            <div className="m-10">
                <hr className=" bg-gray-300 shadow h-0.5" />
            </div>

            {/* Change Images Section */}
            <div className="flex flex-col gap-5 text-start mt-10">
                <div className="mx-20">
                    <h1 className="m-5 text-center text-4xl">Change Images</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {images.filter(image => image.id !== 'bf61e4fe-0d76-420f-8666-b419e02f6564').map(image => (
                            <div key={image.id} className="flex flex-col">
                                <h1 className="ml-4 text-start">{image.name}</h1>
                                <ImageChanger imageId={image.id} />
                            </div>
                        ))}
                        <div className="flex mt-11 min-h-sm max-h-60 min-w-sm mx-3 items-center justify-center">
                            <ImageUploader />
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="mt-10">
                <hr className=" bg-gray-300 shadow h-0.5" />
            </div> */}

            {/* Tuition Fee Section */}
            <div className="flex flex-col w-full mt-10 gap-0">
                <div className=" flex flex-col bg-gradient-to-tr from-emerald-800 to-green-50 gap-16 m-0" >
                    <h1 className="text-center items-center pt-8 text-4xl mt-10">Tuition Table</h1>
                    <TuitionTableEditable key={trigger} setTrigger={setTrigger} trigger={trigger} titleTable="Change Tuition table 3pm" tableName="tuition_3" />
                    <TuitionTableEditable key={trigger2} setTrigger={setTrigger2} trigger={trigger2} titleTable="Change Tuition table 5pm" tableName="tuition_5" />
                </div>
                <div className=" bg-gradient-to-tl to-emerald-800 from-green-50 m-0" >
                    <h1 className="text-center items-center pt-8 text-4xl mt-10">Tuition Fee</h1>
                    <TuitionFee key={trigger3} setTrigger={setTrigger3} trigger={trigger} tableName='tuition_fee' titleTable="Change Tuition fee" />
                </div>
            </div>
            <div className="flex flex-col text-center mt-10 items-center justify-center">
                <ChangePhoneAndEmail />
            </div>
            <div className="mx-10">
                <hr className=" bg-gray-300 shadow h-0.5" />
            </div>
            {/* <div className="flex flex-col text-center my-10 items-center justify-center">
                <ChangeWorkHours />
            </div> */}
        </div>

    );

}

export default AdminPanel

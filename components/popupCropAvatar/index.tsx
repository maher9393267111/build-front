import { Dispatch, ReactElement, SetStateAction, useCallback, useRef, useState } from "react";
import { PiCaretLeft, PiImage, PiX } from "react-icons/pi";
import './style.css';
import Cropper, { Area } from "react-easy-crop";
import getCroppedImg from "./cropImage";
import React from "react";
// import config from "@/config";
// import { ALERT_TYPE, setAlertInfo } from "@/redux/slices/alert.slice";
import he from "he";
// import { useAppDispatch } from "@/redux/hook";

function PopupCropAvatar({ setCroppedImage, setShowPopupCropAvatar }: {
    setCroppedImage: Dispatch<SetStateAction<string | null>>
    setShowPopupCropAvatar: Dispatch<SetStateAction<boolean>>
}): ReactElement {
    // const [showCropAvatar, setShowCropAvatar] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = useState<string | null | ArrayBuffer | undefined>(undefined);
    const [zoom, setZoom] = useState<number>(1);
    // const [rotation, setRotation] = useState(0);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [showGrid, setShowGrid] = useState(false);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [messageCropError, setMessageCropError] = useState<string | undefined>();
    // const dispatch = useAppDispatch();

    const previewImage = useCallback((e: { target: { files: Blob[]; }; }) => {
        const file = e.target.files[0];
        const maxSize = 5 * 1024 * 1024;
        if (file) {
            if (file.size > maxSize) {
                // dispatch(setAlertInfo({ type: ALERT_TYPE.ERROR, content: he.encode(`<div class='text-white-1 p-2 text-xs'>Image so big ! please size < 5MB.</div>`), timeout: 3000 }));
                return;
            }
            const imageMimeType = /image\/(png|jpg|jpeg)/i;
            if (file.type.match(imageMimeType)) {
                const reader = new FileReader();
                reader.onload = function(){
                    const img = new Image();
                    img.onload = () => {
                        const width = img.width;
                        const height = img.height;
                        if (width < 200 || height < 200) {
                            setMessageCropError(`Yêu cầu hình ảnh có kích \n thước ít nhất ${200} x ${200}`);
                            setTimeout(() => {
                                setMessageCropError(undefined);
                            }, 2000);
                            return;
                        }
                        setImageUrl(reader.result);
                    };
                    img.src = reader.result as string;
                };
                reader.readAsDataURL(e.target.files[0]);
            } else {
                setMessageCropError('không phải file ảnh \n vui lòng thử lại');
                setTimeout(() => {
                    setMessageCropError(undefined);
                }, 2000);
                return;
            }
        }
    }, []);

    const chooseImageHandle = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    }, []);

    const showCroppedImage = async () => {
        try {
            const croppedImage = await getCroppedImg(
                imageUrl,
            croppedAreaPixels!,
            0 // rotation
            );
            setCroppedImage(croppedImage as string);
            setShowPopupCropAvatar(false);
        } catch (e) {
            console.error(e);
        }
    };

    const onCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };


    return <>
        <div className="top-0 left-0 w-full h-full z-[2000] fixed bg-white-1 opacity-20" onClick={() => setShowPopupCropAvatar(false)}/>
        <div className="fixed text-white-1 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit max-sm:w-full max-sm:h-full max-sm:rounded-none rounded-2xl z-[3000]">
            <div className='bg-white-3 text-black w-[500px] h-[600px] max-sm:w-full max-sm:h-full max-sm:rounded-none rounded-2xl relative flex flex-col animation-zoomin'>
                <div className={`flex justify-between border-b-solid border-b-[1px] border-b-gray-1 px-4 ${imageUrl ? 'py-3' : 'py-4'}`}>
                    {
                        messageCropError && <div className="bg-black p-3 w-fit h-fit rounded-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            {
                                messageCropError.split('\n').map((text, index) => (
                                    <React.Fragment key={index}>
                                        {text}
                                        <br />
                                    </React.Fragment>
                                ))
                            }
                        </div>
                    }
                    <div className="flex gap-1">
                        {
                            imageUrl && 
                                <div 
                                    className="p-1 rounded-full hover:bg-gray-1" 
                                    onClick={() => setImageUrl(null)}
                                >
                                    <PiCaretLeft className="w-6 h-6 my-auto cursor-pointer"/>
                                </div>
                        }
                        <b className="my-auto">Update avatar</b>
                    </div>
                    <PiX className="w-6 h-6 cursor-pointer" onClick={() => setShowPopupCropAvatar(false)}/>
                </div>
                <div className="flex px-4 relative overflow-hidden h-full rounded-b-2xl">
                    <div className="flex w-full h-fit">
                        <input ref={inputRef} type="file" accept="image/*" id="fileInput" className="hidden" onChange={(e) => previewImage(e as any)}/>
                        <div className="flex mx-auto bg-primary-800 px-3 w-full rounded-lg mt-3 p-2 cursor-pointer" onClick={chooseImageHandle}>
                            <div className="flex gap-2 mx-auto text-white">
                                <PiImage className="w-6 h-6"/>
                                <span>Tải ảnh từ thiết bị</span>
                            </div>
                        </div>
                    </div>
                    {
                        imageUrl && <div className="flex flex-col-reverse w-full h-full px-4 absolute z-10 crop-avatar-slide-right bg-white rounded-b-2xl">
                            <div className="flex justify-end gap-2 mb-4">
                                <div className="hover:bg-red-1 px-2 py-3 rounded-lg cursor-pointer font-bold" onClick={() => setShowPopupCropAvatar(false)}>Cancel</div>
                                <div className="px-2 py-3 bg-primary-800 text-white font-bold rounded-lg cursor-pointer" onClick={showCroppedImage}>Apply</div>
                            </div>
                            <div className="flex flex-col gap-5 justify-center mb-6">
                                {/* <label className="ml-7 mb-[-10px] text-sm">zoom</label> */}
                                <input id="default-range" type="range" min={1} max={5} step={0.1} value={zoom} onChange={(e: any) => setZoom(e.target.value)} className="w-[90%] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mx-auto"/>
                                {/* <label className="ml-7 mb-[-10px] text-sm">rolation</label>
                                <input id="default-range" type="range" min={0} max={360} step={1} value={rotation} onChange={(e: any) => setRotation(e.target.value)} className="w-[90%] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mx-auto"/> */}
                            </div>
                            <div className="flex-1 flex">
                                <div className="relative w-full overflow-x-hidden h-[200px] my-auto">
                                    <Cropper
                                        cropSize={{ width: 200, height: 200 }}
                                        
                                        // style={{ containerStyle: { background: 'white', width: '10000000px', height: '200px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' } }}
                                        cropShape="round"
                                        image={imageUrl as string}
                                        // setMediaSize={{}}
                                        onInteractionStart={() => setShowGrid(true)}
                                        onInteractionEnd={() => setShowGrid(false)}
                                        showGrid={showGrid}
                                        crop={crop}
                                        // rotation={rotation}
                                        zoom={zoom}
                                        // style={{ containerStyle: { background: 'white' } }}
                                        aspect={1} // 2.5 nếu muốn crop full div
                                        onCropChange={setCrop}
                                        onCropComplete={onCropComplete}
                                        onZoomChange={setZoom}
                                        maxZoom={5}
                                        minZoom={1}
                                    />
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
        
    </>;
}

export default PopupCropAvatar;
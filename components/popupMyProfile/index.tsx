// import { ConversationI, UserConversationI } from "@/app/(root)/api/conversation/interface";
"use client";
import { Dispatch, ReactElement, ReactHTMLElement, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { PiCamera, PiMagnifyingGlass, PiPencilDuotone, PiX } from "react-icons/pi";
import Image from 'next/image';
// import { dispatch } from 'redux-persist';
// import { CONVERSATION_TYPE } from "@/constants/chat";
// import { UserLoginI } from "@/app/(auth)/login/api/interface";
// import { PiCheck } from "react-icons/pi";
import './style.css';
// import findUserAddFriendByKeyword from "@/app/(root)/api/conversation/findUserAddFriend";
// import PopupMyProfile from '../../components/popupCropAvatar';
// import createGroup from "@/app/(root)/api/conversation/createGroup";
// import getTokenUploadImage from "@/app/(root)/api/conversation/getTokenUploadImage";
// import getUserLogin from "@/app/(auth)/login/api/getUserLogin";
// import uploadImg from "@/app/(root)/api/conversation/uploadImage";
// import { ApiResponse } from "@/services/fetchApi";
// import getAllMember, { UserMemberResponse } from "@/app/api/user/getAllMember";
// import { useAppDispatch, useAppSelector } from "@/redux/hook";
// import config from "@/config";
// import createGroupConversation from "@/app/api/conversation/createGroupConversation";
// import { ALERT_TYPE, setAlertInfo } from "@/redux/slices/alert.slice";
import he from "he";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PopupCropAvatar from "../../components/popupCropAvatar";
import { setProfile, setShowPopupMyProfile } from "@features/profile/profileSlice";
// import updateProfile from "@api/profile/updateProfile";
// import { config } from "@/config";
// const Fuse = require('fuse.js');

function PopupMyProfile(): ReactElement {
    const [listMemberSelected, setListMemberSelected] = useState<{ id: string, avatar: string, username: string }[]>([]);
    // const [listAllMember, setListAllMember] = useState<UserMemberResponse[]>([]);
    // const [loadingSearchMember, setLoadingSearchMember] = useState<boolean>(false);
    // const [valueInputFindMember, setValueInputFindMember] = useState<string>('');
    const [showPopupCropAvatar, setShowPopupCropAvatar] = useState<boolean>(false);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    // const [groupName, setGroupName] = useState<string>('');
    const { token } = useSelector((state: any) => state.auth);
    const { profile } = useSelector((state: any) => state.profile);
    const dispatch = useDispatch();
    const inputUploadRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState(profile?.cv ? ( ( profile?.cv.split('/').pop() ).substring(38) ) : undefined);
    const [urlCVUpload, setUrlCVUpload] = useState(profile?.cv ? profile.cv : undefined);
    const [email, setEmail] = useState(profile?.email ? profile?.email : undefined);
    const [description, setDescription] = useState(profile?.description ? profile?.description : undefined);
    const [phone, setPhone] = useState(profile?.phone ? profile?.phone : undefined);
    const [name, setName] = useState(profile?.fullname ? profile?.fullname : undefined);
    const [avatarUrlNew, setAvatarUrlNew] = useState();
    const [nameRequire, setNameRequire] = useState(false);
    const [phoneRequire, setPhoneRequire] = useState(false);
    const [emailRequire, setEmailRequire] = useState(false);

    // const debounced = useCallback((func: any, delay: number) => {
    //     let timeout: NodeJS.Timeout;
    //     return function(value: string) {
    //         clearTimeout(timeout);
    //         timeout = setTimeout(() => {
    //             setValueInputFindMember(value);
    //             setLoadingSearchMember(true);
    //             console.log("value: ", value);
    //             func({keyword: value}).then((res: any) => {
    //                 console.log("res: ", res.data);
    //                 setListAllMember(res.data);
    //                 setLoadingSearchMember(false);
    //             });
    //         }, delay);
    //     };
    // }, [valueInputFindMember]);

    // useEffect(() => {
    //     (() => {
    //         getAllMember({keyword: ""}).then(res => {
    //             setListAllMember(res.data);
    //         })
    //     })();
    // }, []);

    // useEffect(() => {
    //     console.log("value ne: ", searchInputRef.current?.value);
    // }, [searchInputRef.current]);

    // const debouncedFetchData = debounced(getAllMember, 500);

    // const selectHandle = useCallback((data: { id: string, avatar: string, username: string }) => {
    //     setListMemberSelected(pre => {
    //         const newData = [...pre];
    //         const userIndex = newData.findIndex(i => i.id == data.id);
    //         if (userIndex == -1) {
    //             return [...pre, data];
    //         }
    //         newData.splice(userIndex, 1);
    //         return newData;
    //     });
    // }, []);

    // const createGroupHandle = useCallback(async () => {
    //     const listUserIdSelected = listMemberSelected.map(i => i.id);
    //     if (!croppedImage || !listUserIdSelected.length || groupName.trim() == "") return;
    //     try {
    //         const byteCharacters = atob(croppedImage.split(',')[1]);
    //         const byteNumbers = new Array(byteCharacters.length);
    //         for (let i = 0; i < byteCharacters.length; i++) {
    //             byteNumbers[i] = byteCharacters.charCodeAt(i);
    //         }
    //         const byteArray = new Uint8Array(byteNumbers);
    //         const blob = new Blob([byteArray], { type: 'image/png' });
    
    //         const formdata = new FormData();
    //         formdata.append("files", blob, "avatar.jpg");
    //         formdata.append("hd", "true");
    //         const myHeaders = new Headers();
    //         myHeaders.append("Authorization", "Bearer " + token);
    
    //         const linkAvatarCropped = await fetch(`${config.APP.BASE_API_UPLOAD_MEDIA}`, {
    //             method: 'POST',
    //             headers: myHeaders,
    //             body: formdata
    //         })
    //             .then(response => response.json())
    //             .then((result: any) => {
    //                 return result?.data?.[0]?.link;
    //             })
    //             .catch(error => {
    //                 console.error('Lỗi upload ảnh khi tạo group: ', error);
    //                 dispatch(setAlertInfo({ type: ALERT_TYPE.ERROR, content: he.encode(`<div class='text-white-1 p-2 text-xs'>Lỗi hệ thống, thử lại sau !</div>`), timeout: 3000 }));
    //                 throw new Error();
    //             });

    //         if (!linkAvatarCropped) {
    //             console.error("Thất bại khi upload ảnh crop khi tạo group");
    //             dispatch(setAlertInfo({ type: ALERT_TYPE.ERROR, content: he.encode(`<div class='text-white-1 p-2 text-xs'>Lỗi hệ thống, thử lại sau !</div>`), timeout: 3000 }));
    //             throw new Error();
    //         }

    //         createGroupConversation(listUserIdSelected, groupName, linkAvatarCropped)
    //             .then(result => {
    //                 console.log("result create group: ", result);
    //                 dispatch(setAlertInfo({ type: ALERT_TYPE.SUCCESS, content: he.encode(`<div class='text-black p-2 text-xs'>Thành công !</div>`), timeout: 3000 }));
    //                 dispatch(addConversation(result.data))
    //                 setShowPopupCreateGroup(false);
    //             })
    //             .catch(e => {
    //                 console.error("Tạo group thất bại: ", e);
    //                 dispatch(setAlertInfo({ type: ALERT_TYPE.ERROR, content: he.encode(`<div class='text-white-1 p-2 text-xs'>Lỗi hệ thống, thử lại sau !</div>`), timeout: 3000 }));
                    
    //                 throw new Error();
    //             });
    //     } catch(e) {
    //         console.error("Lỗi xảy ra khi tạo group");
    //     }
    // }, [listMemberSelected, groupName, croppedImage, token]);

    const chooseFileHandle = useCallback(() => {
        if (inputUploadRef.current) {
            inputUploadRef.current.click();
        }
    }, []);

    function uploadFile(file: unknown, tokenUp: string) {
        return new Promise<void>((resolve, reject) => {
            const formData = new FormData();
            formData.append('files', file as any);
        
            const xhr = new XMLHttpRequest();
        
            // Set up the progress event to monitor progress
            // xhr.upload.addEventListener('progress', (e) => {
            // if (e.lengthComputable) {
            //     const progress = (e.loaded / e.total) * 100;
            //     console.log("progress: ", progress);
            //     // Update the progress bar for this file
            //     const progressBar = document.getElementById(`progress-bar-${messageIdTemp}`);
            //     if (progressBar) {
            //         progressBar.style.display = 'inline'; // Show the progress bar
            //         (progressBar as any).value = progress;
            //     }
                
            //     console.log(`File ${index + 1} progress: ${progress.toFixed(2)}%`);
            // }
            // });
        
            // Handle the response when the file is uploaded
            xhr.onload = () => {
            if (xhr.status === 200) {
                // const progressBar = document.getElementById(`progress-bar-${messageIdTemp}`);
                // if (progressBar) {
                //     progressBar.style.display = 'none';
                // }
                // console.log(`File ${index + 1} uploaded successfully`);
                const responseData = JSON.parse(xhr.responseText);
                // Resolve with the response data
                return resolve(responseData);
            } else {
                // console.log(`Error uploading file ${index + 1}`);
                return reject()
            }
            };
        
            // Handle error
            xhr.onerror = () => {
                // console.log(`Error occurred while uploading file ${index + 1}`);
                return reject()
            };
        
            // Open the request and send the form data
            xhr.open('POST', `${process.env.NEXT_PUBLIC_BASE_API_UPLOAD_MEDIA}`, true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + tokenUp);
            xhr.send(formData);
        })
        
    }

    const handleFileChange = useCallback((e: any) => {
        if (!token) return;
        const file = e.target.files[0];
        const maxSize = 5 * 1024 * 1024;
        if ((file as any).size > maxSize) {
            console.error("file > 5mb")
            return;
        }
        setFileName(file.name);
        uploadFile(file, token)
            .then(res => {
                console.log("res: ", res);
                if ((res as any).success == true) {
                    setUrlCVUpload((res as any)?.data[0]?.link);
                }
            })
            .catch(e => {
                console.log("error: ", e);
            })
    }, [token]);

    // const updateProfileHandle = useCallback(() => {
    //         if (!token) return;
    //         if (!name || !name.length) {
    //             setNameRequire(true)
    //             return
    //         } 

    //         if (!email || !email.length) {
    //             setEmailRequire(true)
    //             return
    //         } 
    //         if (!phone || !phone.length) {
    //             setPhoneRequire(true)
    //             return
    //         } 
    //         updateProfile({ 
    //             token, 
    //             data: { 
    //                 email,
    //                 avatar: avatarUrlNew ? avatarUrlNew : ( profile.avatar ? profile.avatar : undefined ), 
    //                 cv: urlCVUpload, 
    //                 description, 
    //                 education: "default", 
    //                 fullname: name, 
    //                 phone 
    //             } 
    //         }).then(res => {
    //             console.log("res update profile: ", res);
    //             dispatch(setProfile({
    //                 fullname: name,
    //                 avatar: avatarUrlNew ? avatarUrlNew : ( profile.avatar ? profile.avatar : undefined ),
    //                 phone,
    //                 cv: urlCVUpload,
    //                 description,
    //                 email
    //             }))
    //         }).catch(e => {})
    //         .finally(() => {
    //             dispatch(setShowPopupMyProfile(false));
    //         })
    // }, [token, urlCVUpload, name, phone, avatarUrlNew, description, email, profile]);

    useEffect(() => {
        (async () => {
            if (!croppedImage || !token) return;
            try {
                const byteCharacters = atob(croppedImage.split(',')[1]);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'image/png' });
        
                const formdata = new FormData();
                formdata.append("files", blob, "avatar.png");
                formdata.append("hd", "true");
                const myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer " + token);
        
                const linkAvatarCropped = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_UPLOAD_MEDIA}`, {
                    method: 'POST',
                    headers: myHeaders,
                    body: formdata
                })
                    .then(response => response.json())
                    .then((result: any) => {
                        return result?.data?.[0]?.link;
                    })
                    .catch(error => {
                        console.error('Lỗi upload ảnh: ', error);
                        // dispatch(setAlertInfo({ type: ALERT_TYPE.ERROR, content: he.encode(`<div class='text-white-1 p-2 text-xs'>Lỗi hệ thống, thử lại sau !</div>`), timeout: 3000 }));
                        throw new Error();
                    });

                if (!linkAvatarCropped) {
                    console.error("Thất bại khi upload ảnh crop");
                    // dispatch(setAlertInfo({ type: ALERT_TYPE.ERROR, content: he.encode(`<div class='text-white-1 p-2 text-xs'>Lỗi hệ thống, thử lại sau !</div>`), timeout: 3000 }));
                    throw new Error();
                }

                setAvatarUrlNew(linkAvatarCropped);
            } catch(e) {

            }
        })()
    }, [croppedImage, token]);
    return <>
        {
            showPopupCropAvatar && 
                <PopupCropAvatar 
                    setCroppedImage={setCroppedImage} 
                    setShowPopupCropAvatar={setShowPopupCropAvatar}
                />
        }
        <div className="top-0 left-0 w-full h-full z-[900] bg-gray-2 opacity-[0.6] fixed" onClick={() => {dispatch(setShowPopupMyProfile(false));}}/>
        <div className='bg-white text-black w-[600px] max-lg:w-full h-fit z-[1000] p-4 max-h-screen overflow-y-scroll rounded-none fixed top-1/2 left-1/2 transform !-translate-x-1/2 !-translate-y-1/2 flex flex-col animation-zoomin'>
            <div className="flex justify-between pb-2">
                <b className="text-lg">My profile</b><PiX className="w-7 h-7 cursor-pointer" onClick={() => dispatch(setShowPopupMyProfile(false))} />
            </div>
            <div className="flex gap-2 mt-3">
                <div className={`rounded-full border-gray-1 border-solid border-[1px] cursor-pointer mx-auto`} onClick={() => setShowPopupCropAvatar(true)}>{<Image className="rounded-full max-w-[100px] max-h-[100px] min-w-[100px] min-h-[100px]" src={croppedImage ? croppedImage : (profile?.avatar ? profile.avatar : '/images/about/user.png')} width={100} height={100} alt="avatar-group-crop"/>}</div>
                {/* <input className="bg-gray-3 w-full outline-none border-b-[1px] border-b-solid border-gray-1" placeholder="Nhập tên nhóm" onChange={(e) => setGroupName(e.target.value)}/> */}
            </div>
            <div className="flex flex-col w-full gap-2 mt-6">
                <input 
                    ref={inputUploadRef} 
                    type="file"
                    accept="
                        application/msword,
                        application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                        application/pdf,
                        application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
                    "
                    id="fileInput" 
                    className="hidden"
                    onChange={(e) => handleFileChange(e as any)}
                />
                <p className="mx-auto">Supports .doc, .docx, pdf formats under 5MB in size</p>
                <div className="w-fit mx-auto flex gap-2">
                    <div className="text-gray-2 my-auto">{fileName}</div><div className="p-2 bg-primary-800 w-fit rounded-lg text-white font-bold cursor-pointer" onClick={() => chooseFileHandle()}>Upload CV</div>
                </div>
            </div>
            <div className="w-full flex flex-col">
                <p className="text-gray-2">Your name <span className="text-red-1">*</span></p>
                <input value={name} onChange={(e) => { setName(e.target.value); setNameRequire(false) }} className={`w-full outline-none border-solid border-[1px] ${nameRequire ? 'border-red-1' : 'border-gray-5'} p-2 text-gray-2" placeholder="Your name`}/>
            </div>
            <div className="flex gap-3 mt-3">
                <div className="w-full flex flex-col">
                    <p className="text-gray-2">Email <span className="text-red-1">*</span></p>
                    <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailRequire(false) }} className={`w-full outline-none border-solid border-[1px] ${emailRequire ? 'border-red-1' : 'border-gray-5'} p-2 text-gray-2`} placeholder="Your email"/>
                </div>
                <div className="w-full flex flex-col">
                    <p className="text-gray-2">Phone number <span className="text-red-1">*</span></p>
                    <input type="number" value={phone} onChange={(e) => { setPhone(e.target.value); setPhoneRequire(false) }} className={`w-full outline-none border-solid border-[1px] ${phoneRequire ? 'border-red-1' : 'border-gray-5'} p-2 text-gray-2`} placeholder="Your phone number"/>
                </div>
            </div>
            <div className="w-full flex flex-col mt-3">
                <p>Description</p>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border-solid border-[1px] border-gray-5 outline-none p-2 text-black resize-none" rows={3} placeholder="Write a brief introduction about yourself (strengths, weaknesses) and clearly state your wishes and reasons for wanting to apply for this position."/>
            </div>
            <div className="bg-primary-800 text-white p-2 w-fit ml-auto rounded-xl font-bold px-4 mt-3 cursor-pointer" 
            // onClick={() => updateProfileHandle()}
            >Save</div>
        </div>
    </>;
};

export default PopupMyProfile;
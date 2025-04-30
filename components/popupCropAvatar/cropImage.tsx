export const createImage = (url: string): Promise<any> => 
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
        image.src = url;
    });

export function getRadianAngle(degreeValue: number): number {
    return (degreeValue * Math.PI) / 180;
}

export function rotateSize(width: number, height: number, rotation: number): {
    width: number;
    height: number;
} {
    const rotRad = getRadianAngle(rotation);
  
    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height)
    };
}

export default async function getCroppedImg(
    imageSrc: string | ArrayBuffer | null | undefined,
    pixelCrop: { width: number; height: number; x: number; y: number },
    rotation = 0,
    flip = { horizontal: false, vertical: false }
): Promise<string | null> {
    const image: any = await createImage(imageSrc as string);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    if (!ctx) {
        return null;
    }
  
    const rotRad = getRadianAngle(rotation);
  
    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation
    );
  
    // set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;
  
    // translate canvas context to a central location to allow rotating and flipping around the center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);
  
    // draw rotated image
    ctx.drawImage(image, 0, 0);
  
    const croppedCanvas = document.createElement('canvas');
  
    const croppedCtx = croppedCanvas.getContext('2d');
  
    if (!croppedCtx) {
        return null;
    }
  
    // Set the size of the cropped canvas
    croppedCanvas.width = pixelCrop.width;
    croppedCanvas.height = pixelCrop.height;
  
    // Draw the cropped image onto the new canvas
    croppedCtx.drawImage(
        canvas,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );
  
    // As Base64 string
    const base64 = croppedCanvas.toDataURL('image/png');
    // const byteCharacters = atob(base64.split(',')[1]);
    // const byteNumbers = new Array(byteCharacters.length);
    // for (let i = 0; i < byteCharacters.length; i++) {
    //     byteNumbers[i] = byteCharacters.charCodeAt(i);
    // }
    // const byteArray = new Uint8Array(byteNumbers);
    // const blob = new Blob([byteArray], { type: 'image/jpeg' });

    // const formdata = new FormData();
    // formdata.append("files", blob, "filename.jpg");
    // formdata.append("hd", "false");
    // const myHeaders = new Headers();
    // myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwN2E2MzVmMC0yNzI4LTQ3YTgtODIzOS02MTI5Zjk4NmIwMDIiLCJpYXQiOjE3MDYxMDU0MDksImV4cCI6MTcwNjIwNTQwOX0.KwWXP3ivYDEQtZA0QB81eJrjG7QNPvqvD4gLv025ohs");

    // fetch("http://localhost:6001/api/upload", {
    //     method: 'POST',
    //     headers: myHeaders,
    //     body: formdata,
    //     redirect: 'follow'
    // })
    //     .then(response => response.text())
    //     .then(result => console.log(result))
    //     .catch(error => console.log('error', error));
   
    
    return base64;

    // As a blob
    console.log("demo: ", croppedCanvas);
    return new Promise((resolve, reject) => {
        croppedCanvas.toBlob((file) => {
            resolve(URL.createObjectURL(file!));
        }, 'image/jpeg');
    });
}
  
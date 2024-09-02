"use client";

import { useState, useEffect, ImgHTMLAttributes } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Tesseract from "tesseract.js";

export default function ocr() {
  const [imgURL, setImgURL] = useState("");
  const [text, setText] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [imgRef, setImgRef] = useState<HTMLImageElement | undefined>();
  const [cropURL, setCropURL] = useState('');

  useEffect(() => {
    const handlePaste = async () => {
      try {
        const items = await navigator.clipboard.read();
        const blobOut = await items[0].getType("image/png");
        const data = URL.createObjectURL(blobOut);
        setImgURL(data);

        tess(data);
      } catch (e) {
        console.log(e);
      }
    };

    window.addEventListener("paste", handlePaste);
  }, []);

  useEffect(() => { if (cropURL) tess(cropURL)}, [cropURL])

  const tess = async (x: string) => {
    try {

      console.log(`RUNNING TESS ON ${x}`)
      const {
        data: { text },
      } = await Tesseract.recognize(x, "jpn");
      setText(text);
    } catch (e) {
      console.error(e);
    }
  };

  const getCroppedImage = () => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!crop || !imgRef || !ctx || !crop.width || !crop.height ) return;
      const scaleX = imgRef.naturalWidth / imgRef.width;
      const scaleY = imgRef.naturalHeight / imgRef.height;

      canvas.width = crop.width;
      canvas.height = crop.height;


      console.log(crop)
      console.log(canvas)
      console.log(scaleX)
      console.log(scaleY)
      console.log(imgRef)

      try {
      ctx.drawImage(
        imgRef,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      ); } catch (e) {}

      return canvas.toDataURL("image/png");
    } catch (e) {
      console.log(e);
    }
  };

  const handleImgRef = (i: HTMLImageElement) => {
    if (i) setImgRef(i);
    console.log(i)
  };

  return (
    <div className="flex flex-col h-screen">
      <div
        className="flex-1 flex items-center justify-center my-5"
        style={{ maxHeight: "75vh" }}
      >
        <ReactCrop
          crop={crop}
          onChange={(c) => {
            setCrop(c);

              const u = getCroppedImage();
              if (u) setCropURL(u)
          }}
        >

          {imgURL ?           <img
            ref={handleImgRef}
            className="w-[90vh] h-auto max-h-full object-cover"
            src={
              imgURL
            }
          ></img>
        
            : <p>Ctrl + v</p>
        }

        </ReactCrop>
      </div>

      <div className="flex-none h-[25vh] flex items-center justify-center">
        <p className="text-lg">{text}</p>
      </div>
    </div>
  );
}

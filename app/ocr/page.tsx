"use client";

import { useState, useCallback, useEffect } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Tesseract from "tesseract.js";
import { Textarea } from "@/components/ui/textarea"

export default function Ocr() {
  const [imgURL, setImgURL] = useState("");
  const [text, setText] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [imgRef, setImgRef] = useState<HTMLImageElement | undefined>();
  const [cropURL, setCropURL] = useState('');

  const tess = useCallback(async (x: string) => {
    try {
      console.log(`RUNNING TESS ON ${x}`)
      setText("Recognising text...");
      const {
        data: { text },
      } = await Tesseract.recognize(x, "jpn");
      setText(text);
    } catch (e) {
      console.error(e);
      setText("OCR failed. Try a clearer crop or another image.");
    }
  }, []);

  useEffect(() => {
    const handlePaste = async () => {
      try {
        console.log("Handling paste event");
        const items = await navigator.clipboard.read();
        const imageItem = items.find((item) =>
          item.types.some((type) => type.startsWith("image/"))
        );
        const imageType = imageItem?.types.find((type) => type.startsWith("image/"));

        if (!imageItem || !imageType) return;

        const blobOut = await imageItem.getType(imageType);
        const data = URL.createObjectURL(blobOut);
        setCrop(undefined);
        setCropURL("");
        setImgURL(data);

        tess(data);
      } catch {
        setText("Could not read an image from the clipboard.");
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [tess]);

  useEffect(() => { if (cropURL) tess(cropURL)}, [cropURL, tess])

  useEffect(() => {
    return () => {
      if (imgURL) URL.revokeObjectURL(imgURL);
    };
  }, [imgURL]);

  const getCroppedImage = (selectedCrop: Crop) => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!imgRef || !ctx || !selectedCrop.width || !selectedCrop.height ) return;
      const scaleX = imgRef.naturalWidth / imgRef.width;
      const scaleY = imgRef.naturalHeight / imgRef.height;

      canvas.width = selectedCrop.width;
      canvas.height = selectedCrop.height;

      try {
      ctx.drawImage(
        imgRef,
        selectedCrop.x * scaleX,
        selectedCrop.y * scaleY,
        selectedCrop.width * scaleX,
        selectedCrop.height * scaleY,
        0,
        0,
        selectedCrop.width,
        selectedCrop.height
      ); } catch (e) {}

      return canvas.toDataURL("image/png");
    } catch (e) {
      console.error(e);
    }
  };

  const handleImgRef = (i: HTMLImageElement | null) => {
    setImgRef(i ?? undefined);
  };

  return (
    <div className="flex h-screen flex-col gap-4 py-6">
      <div>
        <h1 className="text-2xl font-semibold">Screenshot OCR</h1>
        <p className="text-sm text-muted-foreground">
          Paste an image + crop region.
        </p>
      </div>
      <div
        className="flex-1 flex items-center justify-center rounded-2xl border bg-card p-6"
        style={{ maxHeight: "75vh" }}
      >
        <div className= {imgURL ? "h-[60vh] overflow-hidden rounded-lg border border-gray-100" : ""}>
        <ReactCrop
          crop={crop}
          onChange={(c) => {
            setCrop(c);
          }}
          onComplete={(c) => {
            const u = getCroppedImage(c);
            if (u) setCropURL(u)
          }}
        >

          {imgURL ?           <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={handleImgRef}
            className="max-h-80 w-auto object-contain"
            alt="Pasted image for OCR"
            src={
              imgURL
            }
          ></img>
          </>
        
            : <p className="text-sm text-muted-foreground">Press Ctrl+V to paste an image, then crop to select text.</p>
        }

        </ReactCrop>
        </div>
      </div>

      <div className="flex-none">
        <Textarea className="min-h-[22vh]" value={text} readOnly placeholder="OCR output will appear here.">
        </Textarea>
      </div>
    </div>
  );
}

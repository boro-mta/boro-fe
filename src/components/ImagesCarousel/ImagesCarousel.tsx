import { Box, ImageList, ImageListItem } from "@mui/material";
import React, { useEffect, useState } from "react";

interface ImageData {
  img: string;
  rows: number;
  cols: number;
}

type Props = {
  images: string[];
};

const ImagesCarousel = ({ images }: Props) => {
  const [imagesData, setImagesData] = useState<ImageData[]>([]);

  const convertImagesToImageData = (images: string[]): ImageData[] => {
    let finalImages: ImageData[] = [];
    if (images.length === 1) {
      finalImages.push({ img: images[0], cols: 12, rows: 2 });
    }
    if (images.length === 2) {
      finalImages.push({ img: images[0], cols: 6, rows: 2 });
      finalImages.push({ img: images[1], cols: 6, rows: 2 });
    }

    if (images.length === 3) {
      images.map((img) => finalImages.push({ img, cols: 4, rows: 2 }));
    }
    if (images.length === 4) {
      images.map((img) => finalImages.push({ img, cols: 3, rows: 2 }));
    }
    if (images.length === 5) {
      finalImages.push({ img: images[0], cols: 6, rows: 2 });

      for (let i = 1; i < images.length; i++) {
        finalImages.push({ img: images[i], cols: 3, rows: 1 });
      }
    }
    return finalImages;
  };
  useEffect(() => {
    const calculatedImages: ImageData[] =
      images.length > 0 ? convertImagesToImageData(images) : [];
    setImagesData(calculatedImages);
  }, [images]);

  return (
    <Box sx={{ height: "300px" }}>
      <ImageList
        sx={{ width: "100%" }}
        variant="quilted"
        cols={12}
        rowHeight={150}
      >
        {imagesData.map((item, i) => (
          <ImageListItem
            key={item.img}
            cols={item.cols || 1}
            rows={item.rows || 1}
            sx={{ width: "100%" }}
          >
            <img
              src={item.img}
              alt={item.img}
              style={{ objectFit: images.length < 3 ? "contain" : "cover" }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default ImagesCarousel;

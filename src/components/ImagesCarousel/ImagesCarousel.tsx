import {
  Box,
  ImageList,
  ImageListItem,
  Modal,
  IconButton,
  Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CloseIcon from "@mui/icons-material/Close";

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
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log("here");
    setModalOpen(false);
  };

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

  const handleClickOutsideModal = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    if (
      e.target instanceof Element &&
      e.target.classList.contains("MuiBox-root")
    ) {
      handleCloseModal();
    }
  };

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
            sx={{ width: "100%", cursor: "pointer" }}
            onClick={() => handleImageClick(i)}
          >
            <img
              src={item.img}
              alt={item.img}
              style={{
                objectFit: images.length < 3 ? "contain" : "cover",
                width: "100%",
                height: "100%",
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            outline: "none",
          }}
          onClick={(e) => handleClickOutsideModal(e)}
        >
          <Paper sx={{ maxWidth: "90vw", maxHeight: "90vh", p: 2 }}>
            <Box
              sx={{
                position: "relative",
                bgcolor: "rgba(255, 255, 255, 0.5)",
                borderRadius: "50%",
              }}
            >
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  position: "absolute",
                  top: "5px",
                  left: "15px",
                  zIndex: 1,
                }}
              >
                <CloseIcon
                  sx={{
                    background: "white",
                    borderRadius: "50%",
                    border: "1px solid black",
                  }}
                />
              </IconButton>
              <IconButton
                onClick={() =>
                  setSelectedImageIndex(
                    (selectedImageIndex - 1 + images.length) % images.length
                  )
                }
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "15px",
                  transform: "translateY(-50%)",
                }}
              >
                <KeyboardArrowLeftIcon
                  sx={{
                    background: "white",
                    borderRadius: "50%",
                    border: "1px solid black",
                  }}
                />
              </IconButton>
              <img
                src={images[selectedImageIndex]}
                alt={images[selectedImageIndex]}
                style={{ width: "100%", height: "auto", maxHeight: "70vh" }}
              />
              <IconButton
                onClick={() =>
                  setSelectedImageIndex(
                    (selectedImageIndex + 1) % images.length
                  )
                }
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: "15px",
                  transform: "translateY(-50%)",
                }}
              >
                <KeyboardArrowRightIcon
                  sx={{
                    background: "white",
                    borderRadius: "50%",
                    border: "1px solid black",
                  }}
                />
              </IconButton>
            </Box>
          </Paper>
        </Box>
      </Modal>
    </Box>
  );
};

export default ImagesCarousel;

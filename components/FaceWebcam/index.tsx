import { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "face-api.js";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { FACE_MATCHER_THRESHOLD, VALID_IMAGE_TYPES } from "@/utils/constants";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Bounce, toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";

const FaceWebcam = () => {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | number>(0);
  const resultsQueue = useRef<Array<[string, number]>>([]);
  const [isFaceVerified, setIsFaceVerified] = useState(false);

  const handleFaceVerification = async (bool: boolean) => {
    setIsFaceVerified(bool);
  };

  const processImagesForRecognition = useCallback(async () => {
    setIsLoading(true);
    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    if (user?.pictureUrl) {
      img.src = user?.pictureUrl;
    }

    await img.decode();

    const faceDescription = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!faceDescription) {
      throw new Error("No faces detected for user profile picture");
    }

    const labeledFaceDescriptors = new faceapi.LabeledFaceDescriptors(
      user?.name || "",
      [faceDescription.descriptor]
    );
    const matcher = new faceapi.FaceMatcher(
      labeledFaceDescriptors,
      FACE_MATCHER_THRESHOLD
    );

    setFaceMatcher(matcher);
    console.log("The matcher is", matcher);
    setIsLoading(false);
  }, [user]);

  function parseRecognitionResult(resultString: string): [string, number] {
    const pattern = /(.*) \((\d+\.\d+)\)/;
    const match = resultString?.match(pattern);
    if (match) {
      return [
        match[1] === "unknown" ? "unknown" : "Same",
        parseFloat(match[2]),
      ];
    }
    return ["unknown", 0]; // Default return in case of no match
  }

  function calculateAverageResult(queue: Array<[string, number]>): boolean {
    const sameCount = queue.filter(
      ([result, score]) => result === "Same"
    ).length;

    const threshold = Math.ceil(queue.length * 0.7); // e.g., 70% should be "Same"

    return sameCount >= threshold;
  }

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
    };

    const initialize = async () => {
      await loadModels();
      await processImagesForRecognition();
    };

    initialize();
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing webcam: ", err);
        });

      const handlePlay = () => {
        const displaySize = {
          width: videoRef.current?.videoWidth || 0,
          height: videoRef.current?.videoHeight || 0,
        };
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(async () => {
          if (videoRef.current) {
            const detections = await faceapi
              .detectAllFaces(
                videoRef.current,
                new faceapi.TinyFaceDetectorOptions()
              )
              .withFaceLandmarks()
              .withFaceDescriptors();

            const resizedDetections = faceapi.resizeResults(
              detections,
              displaySize
            );

            const result = resizedDetections.map((res) => {
              const bestMatch = faceMatcher?.findBestMatch(res.descriptor);
              return bestMatch ? bestMatch.toString() : "Unknown";
            });

            const formattedResult =
              result[0] && parseRecognitionResult(result[0]);

            if (formattedResult) {
              resultsQueue.current.push(formattedResult);
              if (resultsQueue.current.length > 20) {
                resultsQueue.current.shift(); // keep the last 20 results
              }

              // check only after reaching 10 results
              const isMatch = calculateAverageResult(resultsQueue.current);
              console.log(
                "FormattedResult:",
                formattedResult,
                "Is Match:",
                isMatch
              );

              handleFaceVerification(isMatch);
            }
          }
        }, 300);
      };

      videoRef.current.addEventListener("play", handlePlay);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        if (videoRef.current) {
          videoRef.current.removeEventListener("play", handlePlay);

          if (videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;

            stream.getTracks().forEach((track) => track.stop());
          }
        }
      };
    }
  }, [faceMatcher]);

  return (
    <div className=" h-fit">
      <div className="flex flex-col gap-2 md:flex-row w-full">
        <div
          className={`w-full border rounded-md overflow-hidden ${
            isFaceVerified
              ? "border-green-400 border-4"
              : "border-red-400 border-4"
          }`}
        >
          <Modal
            size="sm"
            backdrop={"blur"}
            className="pb-4 pt-2"
            hideCloseButton={true}
            isOpen={!isFaceVerified}
          >
            <ModalContent>
              <>
                <ModalBody>
                  <div className="text-lg font-semibold">Face Mismatch!</div>
                  <div>
                    The profile picture uploaded and the person in the webcame
                    are not same!
                  </div>
                  <div>Please wait for some time.</div>
                </ModalBody>
              </>
            </ModalContent>
          </Modal>
          <video ref={videoRef} autoPlay muted className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(FaceWebcam), {
  ssr: false,
});

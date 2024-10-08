"use client"
import React, { useEffect, useRef, useState } from "react"

import { BrowserMultiFormatReader } from "@zxing/library"
import Webcam, { WebcamProps } from "react-webcam"
import { Card } from "./ui/card"

/**
 *
 * @param setOpenScan - função que abre o scanner
 * @param scanRate - default 10 - rate que o processamento da imagem vai ser realizado, quando mais, mais rapido será a leitura, ao custo de performance
 * @param codeType - default 'barras' - tipo de código que será lido, pode ser 'barras' ou 'qr'
 * @param setScanValue - função que será chamada quando o código for lido
 * @param showCropped - default false - se true, mostra a imagem cortada ja cortada no scanRate definido
 * @param children - componente que será renderizado logo a baixo do scanner
 * @param closeOnScan - default true - se true, fecha o scanner quando o código for lido
 * @see zxing - https://zxing-js.github.io/library/
 * @see react-webcam - https://github.com/mozmorris/react-webcam
 * @returns React.ReactNode
 */

interface ScannerProps {
  scanRate?: number
  codeType?: string
  setScanValue: (value: string) => void
  showCropped?: boolean
  children?: React.ReactNode
}
const videoConstraints: WebcamProps["videoConstraints"] = {
  facingMode: "enviroment",
}

export const Scanner: React.FC<ScannerProps> = ({
  scanRate = 100,
  setScanValue,
  codeType = "qr",
  showCropped,
  children,
}) => {
  const [noWebCam, setNoWebCam] = useState(false)
  const [stopScan, setStopScan] = useState(false)
  const [cropped, setCropped] = useState("")
  const reader = new BrowserMultiFormatReader()
  const camRef = useRef<Webcam>(null)
  useEffect(() => {
    if (!cropped) return
    if (stopScan) return
    reader
      .decodeFromImage("", cropped)
      .then((result) => {
        setStopScan(true)
        setScanValue(result.getText())
        window.navigator.vibrate(200)
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {})
  }, [cropped])

  const HandleNoWebcam = () => {
    if (noWebCam) {
      return (
        <div>
          Não foi possível acessar a câmera, verifique se está conectada e tente
          novamente.
        </div>
      )
    }
    return null
  }

  const [deviceId, setDeviceId] = React.useState({})

  const handleDevices = React.useCallback(
    (mediaDevices) => {
      setDeviceId(
        mediaDevices.filter(({ kind }) => kind === "videoinput")[0].deviceId
      )
    },
    [setDeviceId]
  )

  React.useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices)
  }, [handleDevices])

  const handleDecode = async () => {
    const int = setInterval(async () => {
      const img = camRef?.current?.getScreenshot() as string
      if (!img) return

      if (stopScan) {
        clearInterval(int)
        return
      }

      if (codeType === "qr") {
        setCropped(img)
        return
      }
      return

      await cropBase64ImageWithAspectRatio(img, 16, 6).then(
        (newImg: string) => {
          setCropped(newImg)
        }
      )
    }, 1000 / scanRate)
  }

  return (
    <>
      <Card className="w-full h-full min-h-96">
        <div>
          {deviceId && (
            <Webcam
              ref={camRef}
              reversed={true}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{ deviceId: deviceId }}
              onUserMediaError={(e) => {
                console.log(e)
              }}
              onUserMedia={(e) => {
                console.log("userMedia", e)
                if (!noWebCam && !stopScan) {
                  handleDecode()
                }
              }}
              style={{
                display: noWebCam || showCropped ? "none" : "block",
              }}
            />
          )}
          {showCropped && cropped && <img src={cropped || ""} alt="crop" />}
        </div>

        <HandleNoWebcam />
      </Card>
      {children}
    </>
  )
}

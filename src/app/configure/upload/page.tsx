'use client'

import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import { useUploadThing } from '@/lib/uploadthing'
import { cn } from '@/lib/utils'
import { Image as IconImage, Loader2, MousePointerSquareDashed, Upload, Wand2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import Dropzone, { FileRejection } from 'react-dropzone'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import NextImage from "next/image";
import { Skeleton } from "@/components/ui/skeleton"

const formSchema = z.object({
  prompt: z
    .string()
    .min(7, { message: "Prompt must be at least 7 characters long" }),
});

// Utility function to convert base64 to a File object
const dataURLtoFile = (dataurl: string, filename: string): File | null => {
  const arr = dataurl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : '';

  if (!mime) {
    console.error("Invalid data URL: No valid MIME type found.");
    return null;
  }

  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

const Page = () => {
  const { toast } = useToast()
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isPending, startTransition] = useTransition()

  const [outputImg, setoutputImg] = useState<string | null>(null);
  const [loading, setloading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter()

  const [isAIMode, setIsAIMode] = useState(true)

  const { startUpload, isUploading } = useUploadThing('imageUploader', {
    onClientUploadComplete: ([data]) => {
      const configId = data.serverData.configId
      startTransition(() => {
        router.push(`/configure/design?id=${configId}`)
      })
    },
    onUploadProgress(p) {
      setUploadProgress(p)
    },
  })

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [file] = rejectedFiles
    setIsDragOver(false)
    toast({
      title: `${file.file.type} type is not supported.`,
      description: "Please choose a PNG, JPG, or JPEG image instead.",
      variant: "destructive"
    })
  }

  const onDropAccepted = (acceptedFiles: File[]) => {
    startUpload(acceptedFiles, { configId: undefined })
    setIsDragOver(false)
  }

  const handleImageUploadClick = () => {
    if (outputImg) {
      setUploading(true);
      const file = dataURLtoFile(outputImg, "generated-image.png");
  
      if (file) {
        startUpload([file], { configId: undefined });
      } else {
        toast({
          title: "Invalid Image",
          description: "The generated image could not be converted to a file.",
          variant: "destructive",
        });
        setUploading(false);
      }
    } else {
      toast({
        title: "No Image to Upload",
        description: "Please generate an image first before uploading.",
        variant: "destructive",
      });
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setloading(true);
    try {
      const response = await fetch("/api/image", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await response.json();
      const img = new Image();
      img.crossOrigin = "anonymous"; 
      img.src = data.url;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          console.error("Failed to get 2D context");
          toast({
            title: "Error",
            description: "Unable to create 2D context for canvas.",
            variant: "destructive",
          });
          return;
        }

        ctx.drawImage(img, 0, 0);

        const imageType = "image/png";
        const convertedImage = canvas.toDataURL(imageType);

        setoutputImg(convertedImage);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setloading(false);
    }
  }

  return (
    <div className='flex flex-col w-full min-h-screen bg-white'>
      <div className='p-6 flex justify-center items-center bg-white shadow-sm'>
        <div className='flex items-center space-x-4 bg-gray-200 p-2 rounded-full'>
          <button
            onClick={() => setIsAIMode(true)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
              isAIMode ? 'bg-orange-400 text-white' : 'text-gray-600'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span className='text-sm font-medium'>AI Image</span>
          </button>
          <button
            onClick={() => setIsAIMode(false)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
              !isAIMode ? 'bg-orange-400 text-white' : 'text-gray-600'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span className='text-sm font-medium'>Upload Image</span>
          </button>
        </div>
      </div>
      
      <div className='flex-1 transition-all duration-300 ease-in-out p-6 md:p-12'>
        {isAIMode ? (
          <div id='ai-image' className='w-full h-full flex flex-col items-center justify-center max-w-3xl mx-auto'>
            <div className="w-full px-4 mb-8">
              <h2 className="font-bold text-3xl text-gray-800 mb-4">
                Generate Imaginative Images
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Enter your creative prompt below to generate any imaginative image!
              </p>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full flex flex-col gap-4"
                >
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="e.g., a kitten sitting on a park bench"
                            className="w-full text-base p-4 rounded-lg border-2 border-gray-300 focus:border-orange-400 transition-all"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button
                    className="bg-orange-400 text-white font-medium text-lg hover:bg-orange-500 transition-all w-full py-6 rounded-lg"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Wand2 className="w-5 h-5 mr-2" />}
                    {loading ? 'Generating...' : 'Generate'}
                  </Button>
                </form>
              </Form>
            </div>
            
            <div className="relative rounded-xl bg-gray-100 p-4 ring-2 ring-dashed ring-gray-300 shadow-lg text-gray-900 text-sm w-full aspect-video flex justify-center items-center mb-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="animate-spin h-24 w-24 text-orange-400 mb-8" />
                  <p className="text-center text-gray-500 text-lg">Generating image...</p>
                </div>
              ) : outputImg ? (
                <NextImage className="w-full h-full object-contain rounded-lg" src={outputImg} alt="output" width={500} height={500} />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <IconImage className='h-24 w-24 text-gray-400 mb-8' />
                  <p className="text-center text-gray-500 text-lg">Your generated image will appear here</p>
                </div>
              )}
            </div>
            <div className="w-full px-4">
              <Button
                className="bg-orange-400 text-white font-medium text-lg hover:bg-orange-500 transition-all w-full py-6 rounded-lg"
                type="button"
                disabled={loading || !outputImg || uploading}
                onClick={handleImageUploadClick}
              >
                {uploading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="w-5 h-5 mr-2" />}
                {uploading ? 'Uploading...' : 'Upload this Image'}
              </Button>
            </div>
          </div>
        ) : (
          <div id='upload-image'
            className={cn(
              'w-full h-full rounded-xl bg-gray-100 p-8 ring-2 ring-dashed ring-gray-300 shadow-lg flex justify-center items-center',
              {
                'ring-orange-400 bg-orange-50': isDragOver,
              }
            )}>
            <Dropzone
              onDropRejected={onDropRejected}
              onDropAccepted={onDropAccepted}
              accept={{
                'image/png': ['.png'],
                'image/jpeg': ['.jpeg'],
                'image/jpg': ['.jpg'],
              }}
              onDragEnter={() => setIsDragOver(true)}
              onDragLeave={() => setIsDragOver(false)}>
              {({ getRootProps, getInputProps }) => (
                <div
                  className='h-full w-full flex flex-col items-center justify-center p-8'
                  {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p className="text-lg font-medium text-gray-700 mb-4">Upload your image here</p>
                  {isDragOver ? (
                    <MousePointerSquareDashed className='h-24 w-24 text-orange-400 mb-8' />
                  ) : isUploading || isPending ? (
                    <Loader2 className='animate-spin h-24 w-24 text-orange-400 mb-8' />
                  ) : (
                    <Upload className='h-24 w-24 text-gray-400 mb-8' />
                  )}
                  <div className='flex flex-col justify-center mb-8 text-lg text-gray-700 text-center'>
                    {isUploading ? (
                      <div className='flex flex-col items-center'>
                        <p className='mb-4 font-medium'>Uploading...</p>
                        <Progress
                          value={uploadProgress}
                          className='w-64 h-2 bg-gray-200'
                        />
                      </div>
                    ) : isPending ? (
                      <div className='flex flex-col items-center'>
                        <p className='font-medium'>Redirecting, please wait...</p>
                      </div>
                    ) : isDragOver ? (
                      <p className='font-medium'>
                        Drop file to upload
                      </p>
                    ) : (
                      <p>
                        <span className='font-semibold'>Click to upload</span> or
                        drag and drop
                      </p>
                    )}
                  </div>
                  {isPending ? null : (
                    <p className='text-sm text-gray-500'>PNG, JPG, JPEG</p>
                  )}
                </div>
              )}
            </Dropzone>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
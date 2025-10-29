 //Design Configurator
"use client";

import HandleComponent from "@/components/HandleComponent";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, formatPrice } from "@/lib/utils";
import NextImage from "next/image";
import { Rnd } from "react-rnd";
import { RadioGroup } from "@headlessui/react";
import { useRef, useState, useEffect } from "react";
import {
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from "@/validators/option-validator";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ChevronsUpDown, Heart } from "lucide-react";
import { BASE_PRICE } from "@/config/products";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { saveConfig as _saveConfig, SaveConfigArgs } from "./actions";
import { useRouter } from "next/navigation";

interface DesignConfiguratorProps {
  configId: string;
  imageUrl: string;
  imageDimensions: { width: number; height: number };
}

const DesignConfigurator = ({
  configId,
  imageUrl,
  imageDimensions,
}: DesignConfiguratorProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const { mutate: saveConfig, isPending } = useMutation({
    mutationKey: ["save-config"],
    mutationFn: async (args: SaveConfigArgs) => {
      await Promise.all([saveConfiguration(), _saveConfig(args)]);
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "There was an error on our end. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.push(`/configure/preview?id=${configId}`);
    },
  });

  const [options, setOptions] = useState<{
    color: (typeof COLORS)[number];
    model: (typeof MODELS.options)[number];
    material: (typeof MATERIALS.options)[number];
    finish: (typeof FINISHES.options)[number];
  }>({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  });

  const [renderedDimension, setRenderedDimension] = useState({
    width: imageDimensions.width / 4,
    height: imageDimensions.height / 4,
  });

  const [renderedPosition, setRenderedPosition] = useState({
    x: 150,
    y: 205,
  });

  const phoneCaseRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { startUpload } = useUploadThing("imageUploader");

  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    // Check if configuration is in wishlist
    const checkWishlist = async () => {
      try {
        const response = await fetch('/api/wishlist');
        if (response.ok) {
          const data = await response.json();
          const inWishlist = data.wishlist.some((item: any) => item.configurationId === configId);
          setIsInWishlist(inWishlist);
        }
      } catch (error) {
        console.error('Error checking wishlist:', error);
      }
    };

    checkWishlist();
  }, [configId]);

  const toggleWishlist = async () => {
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch('/api/wishlist', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: configId }),
        });
        if (response.ok) {
          setIsInWishlist(false);
          toast({
            title: "Removed from wishlist",
            description: "This configuration has been removed from your wishlist.",
          });
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            configurationId: configId,
            imageUrl: imageUrl,
            title: "Custom Phone Case",
            description: "",
            userId: "user123"
          }),
        });
        if (response.ok) {
          setIsInWishlist(true);
          toast({
            title: "Added to wishlist",
            description: "This configuration has been added to your wishlist.",
          });
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast({
        title: "Something went wrong",
        description: "There was an error updating your wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  async function saveConfiguration() {
    try {
      const {
        left: caseLeft,
        top: caseTop,
        width,
        height,
      } = phoneCaseRef.current!.getBoundingClientRect();

      const { left: containerLeft, top: containerTop } =
        containerRef.current!.getBoundingClientRect();

      const leftOffset = caseLeft - containerLeft;
      const topOffset = caseTop - containerTop;

      const actualX = renderedPosition.x - leftOffset;
      const actualY = renderedPosition.y - topOffset;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      const userImage = new Image();
      userImage.crossOrigin = "anonymous";
      userImage.src = imageUrl;
      await new Promise((resolve) => (userImage.onload = resolve));

      ctx?.drawImage(
        userImage,
        actualX,
        actualY,
        renderedDimension.width,
        renderedDimension.height
      );

      const base64 = canvas.toDataURL();
      const base64Data = base64.split(",")[1];

      const blob = base64ToBlob(base64Data, "image/png");
      const file = new File([blob], "filename.png", { type: "image/png" });

      await startUpload([file], { configId });
    } catch (err) {
      toast({
        title: "Something went wrong",
        description:
          "There was a problem saving your config, please try again.",
        variant: "destructive",
      });
    }
  }

  function base64ToBlob(base64: string, mimeType: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  return (
    <div className="relative mt-20 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20">
      <div
        ref={containerRef}
        className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <div className="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]">
          <AspectRatio
            ref={phoneCaseRef}
            ratio={896 / 1831}
            className="pointer-events-none relative z-50 aspect-[896/1831] w-full"
          >
            <NextImage
              fill
              alt="phone image"
              src="/phone-template.png"
              className="pointer-events-none z-50 select-none"
            />
          </AspectRatio>
          <div className="absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
          <div
            className={cn(
              "absolute inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px]",
              `bg-${options.color.tw}`
            )}
          />
        </div>

        <Rnd
          default={{
            x: 150,
            y: 205,
            height: imageDimensions.height / 4,
            width: imageDimensions.width / 4,
          }}
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            setRenderedDimension({
              height: parseInt(ref.style.height.slice(0, -2)),
              width: parseInt(ref.style.width.slice(0, -2)),
            });

            setRenderedPosition({ x, y });
          }}
          onDragStop={(_, data) => {
            const { x, y } = data;
            setRenderedPosition({ x, y });
          }}
          className="absolute z-20 border-[3px] border-primary"
          lockAspectRatio
          resizeHandleComponent={{
            bottomRight: <HandleComponent />,
            bottomLeft: <HandleComponent />,
            topRight: <HandleComponent />,
            topLeft: <HandleComponent />,
          }}
        >
          <div className="relative w-full h-full">
            <NextImage
              src={imageUrl}
              fill
              alt="your image"
              className="pointer-events-none"
            />
          </div>
        </Rnd>
      </div>

      <div className="h-[37.5rem] w-full col-span-full lg:col-span-1 flex flex-col bg-white rounded-lg shadow-sm">
        <ScrollArea className="relative flex-1">
          <div className="px-8 pb-14 pt-8 space-y-6">
            <h2 className="tracking-tight font-bold text-2xl text-gray-900">
              Customize your case
            </h2>

            <div className="w-full h-px bg-zinc-200" />

            <div className="space-y-6">
              <div className="space-y-6">
                <RadioGroup
                  value={options.color}
                  onChange={(val) => {
                    setOptions((prev) => ({
                      ...prev,
                      color: val,
                    }));
                  }}
                >
                  <Label className="text-base font-semibold">
                    Color: {options.color.label}
                  </Label>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    {COLORS.map((color) => (
                      <RadioGroup.Option
                        key={color.label}
                        value={color}
                        className={({ active, checked }) =>
                          cn(
                            "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent transition-all duration-200",
                            {
                              [`border-${color.tw} scale-110`]:
                                active || checked,
                            }
                          )
                        }
                      >
                        <span
                          className={cn(
                            `bg-${color.tw}`,
                            "h-8 w-8 rounded-full border border-black border-opacity-10 transition-transform hover:scale-105"
                          )}
                          aria-label={color.label}
                        />
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>

                <div className="flex flex-col gap-3">
                  <Label className="text-base font-semibold">Model</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between py-5 text-base"
                      >
                        {options.model.label}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[calc(100vw-4rem)] lg:w-[400px]">
                      {MODELS.options.map((model) => (
                        <DropdownMenuItem
                          key={model.label}
                          className={cn(
                            "flex text-base gap-2 items-center p-3 cursor-pointer hover:bg-zinc-100 transition-colors",
                            {
                              "bg-zinc-100":
                                model.label === options.model.label,
                            }
                          )}
                          onClick={() => {
                            setOptions((prev) => ({ ...prev, model }));
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              model.label === options.model.label
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {model.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {[MATERIALS, FINISHES].map(
                  ({ name, options: selectableOptions }) => (
                    <RadioGroup
                      key={name}
                      value={options[name]}
                      onChange={(val) => {
                        setOptions((prev) => ({
                          ...prev,
                          [name]: val,
                        }));
                      }}
                    >
                      <Label className="text-base font-semibold">
                        {name.slice(0, 1).toUpperCase() + name.slice(1)}
                      </Label>
                      <div className="mt-3 space-y-3">
                        {selectableOptions.map((option) => (
                          <RadioGroup.Option
                            key={option.value}
                            value={option}
                            className={({ active, checked }) =>
                              cn(
                                "relative block cursor-pointer rounded-lg bg-white px-4 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between hover:border-primary transition-colors duration-200",
                                {
                                  "border-primary shadow-md": active || checked,
                                }
                              )
                            }
                          >
                            <span className="flex items-center">
                              <span className="flex flex-col text-sm">
                                <RadioGroup.Label
                                  className="font-semibold text-gray-900"
                                  as="span"
                                >
                                  {option.label}
                                </RadioGroup.Label>

                                {option.description ? (
                                  <RadioGroup.Description
                                    as="span"
                                    className="text-gray-500 mt-1"
                                  >
                                    <span className="block sm:inline">
                                      {option.description}
                                    </span>
                                  </RadioGroup.Description>
                                ) : null}
                              </span>
                            </span>

                            <RadioGroup.Description
                              as="span"
                              className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
                            >
                              <span className="font-semibold text-gray-900">
                                {formatPrice(option.price / 100)}
                              </span>
                            </RadioGroup.Description>
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  )
                )}
              </div>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="sticky bottom-0 z-10 h-12 bg-gradient-to-t from-white pointer-events-none"
          />
        </ScrollArea>

        <div className="sticky bottom-0 w-full px-8 h-20 bg-white border-t border-zinc-200">
          <div className="w-full h-full flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleWishlist}
                className={cn(
                  "flex items-center gap-2",
                  isInWishlist && "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                )}
              >
                <Heart className={cn("h-4 w-4", isInWishlist && "fill-current")} />
                {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">Total:</span>
                <p className="font-semibold text-xl">
                  {formatPrice(
                    (BASE_PRICE + options.finish.price + options.material.price) /
                      100
                  )}
                </p>
              </div>
            </div>
            <Button
              onClick={() =>
                saveConfig({
                  configId,
                  color: options.color.value,
                  finish: options.finish.value,
                  material: options.material.value,
                  model: options.model.value,
                })
              }
              size="lg"
              className="min-w-[160px] text-base font-medium"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <span className="animate-spin">⌛</span>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Continue
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignConfigurator;

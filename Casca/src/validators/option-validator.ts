
// bg-blue-950 border-blue-950
// bg-zinc-900 border-zinc-900
// bg-rose-950 border-rose-950
// bg-white border-white
// bg-red-600 border-red-600
// bg-blue-600 border-blue-600
// bg-orange-600 border-orange-600
// bg-green-500 border-green-500

// bg-gray-400 border-gray-400
// bg-sky-400 border-sky-400
// bg-pink-400 border-pink-400
// bg-yellow-300 border-yellow-300

import { PRODUCT_PRICES } from "@/config/products"


export const COLORS = [
    { label: "Black", value: "black", tw: "zinc-900" },
    { label: "Blue", value: "blue", tw: "blue-950" },
    { label: "Rose", value: "rose", tw: "rose-950" },
    { label: "White", value: "white", tw: "white" },
    { label: "Red", value: "red", tw: "red-600" },
    { label: "Light Blue", value: "lightblue", tw: "blue-600" },
    { label: "Orange", value: "orange", tw: "orange-600" },
    { label: "Green", value: "green", tw: "green-500" },

    { label: "Gray", value: "gray", tw: "gray-400" },
    { label: "Sky", value: "sky", tw: "sky-400" },
    { label: "Pink", value: "pink", tw: "pink-400" },
    { label: "Yellow", value: "yellow", tw: "yellow-300" },
  ] as const;

export const MODELS = {
    name: "models",
    options: [
        {
            label: 'iPhone X',
            value: 'iphonex',
        },
        {
            label: 'iPhone 11',
            value: 'iphone11',
        },
        {
            label: 'iPhone 12',
            value: 'iphone12',
        },
        {
            label: 'iPhone 13',
            value: 'iphone13',
        },
        {
            label: 'iPhone 14',
            value: 'iphone14',
        },
        {
            label: 'iPhone 15',
            value: 'iphone15',
        },
    ],
}as const

export const MATERIALS ={
    name: "material",
    options: [
        {
            label:"Silicone",
            value:"silicone",
            description: undefined,
            price: PRODUCT_PRICES.material.silicone,
        },
        {
            label:"Soft Polycarbonate",
            value:"polycarbonate",
            description: "scratch resistant coating",
            price: PRODUCT_PRICES.material.polycarbonate,
        },
    ],
} as const

export const FINISHES ={
    name: "finish",
    options: [
        {
            label:"Smooth Finish",
            value:"smooth",
            description: undefined,
            price: PRODUCT_PRICES.finish.smooth ,
        },
        {
            label:"Textured Finish",
            value:"textured",
            description: "soft and grippy texture",
            price: PRODUCT_PRICES.finish.textured,
        },
    ],
} as const
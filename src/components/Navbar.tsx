
import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import {
  ArrowRight,
  User as UserIcon,
  PackageOpen,
  LogOut,
  Heart,
} from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import CartButton from "@/components/CartButton";
import WishlistButton from "@/components/Wishlist";

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;

  return (
    <nav className="sticky top-0 inset-x-0 z-[100] h-14 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          {/* Logo */}
          <Link href="/" className="flex z-40 font-semibold text-lg">
            CΛS<span className="text-orange-600">CA</span>
          </Link>

          {/* Right side */}
          <div className="flex items-center space-x-4 h-full">
            {user ? (
              <>
                {/* Gallery & Reviews */}
                <Link
                  href="/gallery"
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Gallery
                </Link>
                <Link
                  href="/#reviews"
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Reviews
                </Link>

                {/* Wishlist & Cart */}
                <Link
                  href="/wishlist"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Wishlist
                </Link>
                <CartButton />

                {/* Admin Dashboard */}
                {isAdmin && (
                  <Link
                    href="/dashboard"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                  >
                    Dashboard
                  </Link>
                )}

                {/* Create Case */}
                <Link
                  href="/configure/upload"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1",
                  })}
                >
                  Create Case
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>

                {/* User dropdown */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="ml-2 flex items-center focus:outline-none">
                          {user.picture ? (
                            <Image
                              src={user.picture}
                              alt="Profile"
                              width={32}
                              height={32}
                              className="rounded-full border border-zinc-200 object-cover transition-transform hover:scale-105"
                            />
                          ) : (
                            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 border border-zinc-200 transition-transform hover:scale-105">
                              <UserIcon className="h-5 w-5 text-zinc-500" />
                            </span>
                          )}
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link href="/profile" className="flex items-center gap-2">
                              <UserIcon className="h-4 w-4" />
                              View Profile
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/orders" className="flex items-center gap-2">
                              <PackageOpen className="h-4 w-4" />
                              My Orders
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <LogoutLink className="flex items-center gap-2 text-red-600">
                              <LogOut className="h-4 w-4" />
                              Log Out
                            </LogoutLink>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="end">
                      My Account
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            ) : (
              <>
                {/* Unauthenticated Links */}
                <Link
                  href="/gallery"
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Gallery
                </Link>
                <Link
                  href="/#reviews"
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Reviews
                </Link>

                <RegisterLink
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Sign Up
                </RegisterLink>
                <LoginLink
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Login
                </LoginLink>

                <Link
                  href="/configure/upload"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1",
                  })}
                >
                  Create Case
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;

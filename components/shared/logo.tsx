"use client"

import * as React from "react"
import { useId } from "react"
import { cn } from "@/lib/utils"

interface LogoProps extends React.ComponentProps<"div"> {
  className?: string
}

export function Logo({ className, ...props }: LogoProps) {
  const id = useId().replace(/:/g, "_")
  const maskId = `mask0_${id}`
  const gradientIds = [
    `paint0_linear_${id}`,
    `paint1_linear_${id}`,
    `paint2_linear_${id}`,
    `paint3_linear_${id}`,
    `paint4_linear_${id}`,
    `paint5_linear_${id}`,
    `paint6_linear_${id}`,
  ] as const

  return (
    <div className={cn("flex items-center h-10 w-auto", className)} {...props}>
      <svg
        viewBox="0 0 225 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        aria-hidden
      >
        <mask
          id={maskId}
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="225"
          height="60"
        >
          <path d="M0 0H224.035V60H0V0Z" fill="white" />
        </mask>
        <g mask={`url(#${maskId})`}>
          <path
            d="M3.02755 0.570969L16.2215 0.638294C18.3246 0.648941 20.276 1.7344 21.3944 3.51521L37.9669 29.905C38.5479 30.8303 38.5904 31.9956 38.0782 32.9608L29.3139 49.4785C28.7428 50.5543 27.2081 50.5738 26.6102 49.5122L0.992878 4.03199C0.118442 2.47977 1.24595 0.56192 3.02755 0.570969Z"
            fill={`url(#${gradientIds[0]})`}
          />
          <path
            d="M38.8567 40.8271C41.3459 36.1981 42.757 34.1829 45.3069 32.7784C46.263 32.2515 49.1631 30.7096 52.6028 31.5407C53.5156 31.761 55.789 32.3103 57.2198 34.4788C58.9463 37.0952 58.0919 40.0171 57.9543 40.4599C56.2584 44.3065 54.4925 47.3173 53.1273 49.4315C50.0727 54.1632 48.1327 57.0798 44.4181 58.5082C43.9245 58.698 42.0292 59.3885 39.4863 59.3476C37.7552 59.3199 34.3437 59.2651 32.928 57.459C31.1395 55.1774 33.712 50.394 38.8567 40.8271Z"
            fill={`url(#${gradientIds[1]})`}
          />
          <path
            d="M60.8924 27.6582C56.293 27.6233 51.6933 27.5882 47.0938 27.5533C46.9142 27.5004 46.0965 27.2391 45.6246 26.3989C45.0121 25.3079 45.5209 24.1979 45.5722 24.0904C48.6327 18.4066 51.6933 12.7228 54.7538 7.03894C55.384 5.98914 56.8832 3.81582 59.6856 2.26466C62.0016 0.982815 64.1621 0.703932 65.3519 0.638203H75.7927C75.9391 0.635275 77.0014 0.631285 77.6291 1.42509C78.2811 2.2495 78.202 3.6032 77.3143 4.57317C72.6486 13.4833 69.0577 20.1193 67.4507 23.1984C67.068 23.9318 66.2391 25.5344 64.4601 26.6089C63.0836 27.4402 61.6993 27.6169 60.8924 27.6582Z"
            fill={`url(#${gradientIds[2]})`}
          />
          <path
            d="M88.8883 16.0495L93.9407 16.1142C95.6488 16.1363 97.1776 17.1786 97.8219 18.7607L107.812 43.2928L118.48 18.1473C119.139 16.594 120.654 15.5777 122.341 15.5578L128.219 15.4878C129.68 15.4702 130.678 16.958 130.108 18.3032L113.387 57.7814C112.975 58.7522 112.024 59.3826 110.97 59.3826H105.106C104.036 59.3826 103.072 58.7322 102.672 57.7393L86.9838 18.8325C86.4428 17.4908 87.4417 16.0309 88.8883 16.0495Z"
            fill={`url(#${gradientIds[3]})`}
          />
          <path
            d="M178.498 0.760315H185.846C186.638 0.760315 187.28 1.40244 187.28 2.19465V57.6684C187.28 58.4606 186.638 59.1027 185.846 59.1027H178.365C177.571 59.1027 176.929 58.4585 176.93 57.6649L177.063 2.19119C177.065 1.40031 177.707 0.760315 178.498 0.760315Z"
            fill={`url(#${gradientIds[4]})`}
          />
          <path
            d="M198.439 3.85565L205.956 3.96156C206.617 3.97087 207.148 4.50895 207.148 5.1697V15.5908L221.201 15.7196C221.863 15.7257 222.398 16.2651 222.398 16.928V24.0363C222.398 24.7035 221.857 25.2445 221.189 25.2445H207.288L207.401 44.8496C207.418 47.7909 209.807 50.1662 212.748 50.1662H221.788C222.434 50.1662 222.957 50.6896 222.957 51.3352V58.0608C222.957 58.7115 222.426 59.2368 221.776 59.2296L211.298 59.1152C203.572 59.0308 197.354 52.744 197.354 45.0178V24.9648H192.406C191.739 24.9648 191.198 24.4238 191.198 23.7564V16.6592C191.198 15.9918 191.739 15.4508 192.406 15.4508H197.214V5.06379C197.214 4.39 197.765 3.84607 198.439 3.85565Z"
            fill={`url(#${gradientIds[5]})`}
          />
          <path
            d="M163.481 32.9572C161.587 27.8226 156.811 24.3299 151.466 24.1429C145.683 23.9406 140.333 27.6481 138.403 33.272C146.762 33.1672 155.122 33.0621 163.481 32.9572ZM172.24 40.8444C171.918 41.0725 171.568 41.1132 171.366 41.1244C170.195 41.1893 156.918 41.2133 138.802 41.1944C138.809 41.6545 138.855 42.3309 139.047 43.1181C140.038 47.1941 143.912 50.0462 147.427 51.1104C151.653 52.3904 155.26 51.0551 156.608 50.5335C159.348 49.4738 161.243 47.8327 162.404 46.5815C162.94 46.0035 163.836 45.9508 164.427 46.474L168.64 50.2078C169.28 50.7743 169.296 51.7664 168.674 52.3513C166.095 54.7761 159.565 59.7515 150.627 59.4527C139.796 59.0905 129.011 51.1091 128.486 38.6235C127.941 25.6459 139.008 15.7817 150.102 15.1188C158.187 14.6356 165.613 19.0793 169.515 24.6676C169.515 24.6676 173.464 30.323 173.03 38.8859C173.011 39.2693 172.957 40.337 172.24 40.8444Z"
            fill={`url(#${gradientIds[6]})`}
          />
        </g>
        <defs>
          <linearGradient
            id={gradientIds[0]}
            x1="38.4345"
            y1="25.434"
            x2="0.690552"
            y2="25.434"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF3C00" />
            <stop offset="0.5" stopColor="#FF6600" />
            <stop offset="1" stopColor="#FF9300" />
          </linearGradient>
          <linearGradient
            id={gradientIds[1]}
            x1="58.2868"
            y1="45.3244"
            x2="32.3614"
            y2="45.3244"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF3C00" />
            <stop offset="0.5" stopColor="#FF6600" />
            <stop offset="1" stopColor="#FF9300" />
          </linearGradient>
          <linearGradient
            id={gradientIds[2]}
            x1="78.0586"
            y1="14.148"
            x2="45.3253"
            y2="14.148"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF3C00" />
            <stop offset="0.5" stopColor="#FF6600" />
            <stop offset="1" stopColor="#FF9300" />
          </linearGradient>
          <linearGradient
            id={gradientIds[3]}
            x1="130.271"
            y1="37.4351"
            x2="86.8347"
            y2="37.4351"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF3C00" />
            <stop offset="0.5" stopColor="#FF6600" />
            <stop offset="1" stopColor="#FF9300" />
          </linearGradient>
          <linearGradient
            id={gradientIds[4]}
            x1="187.28"
            y1="29.9315"
            x2="176.93"
            y2="29.9315"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF3C00" />
            <stop offset="0.5" stopColor="#FF6600" />
            <stop offset="1" stopColor="#FF9300" />
          </linearGradient>
          <linearGradient
            id={gradientIds[5]}
            x1="222.957"
            y1="31.5426"
            x2="191.198"
            y2="31.5426"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF3C00" />
            <stop offset="0.5" stopColor="#FF6600" />
            <stop offset="1" stopColor="#FF9300" />
          </linearGradient>
          <linearGradient
            id={gradientIds[6]}
            x1="173.063"
            y1="37.2742"
            x2="128.467"
            y2="37.2742"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF3C00" />
            <stop offset="0.5" stopColor="#FF6600" />
            <stop offset="1" stopColor="#FF9300" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

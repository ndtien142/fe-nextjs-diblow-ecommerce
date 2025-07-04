"use client";

import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="p-0 container">
      <div className="border-t-[3px] border-t-gray-500 border-solid" />
      <div className="mt-12 sm:mt-1 px-4 mb-6 text-gray-500">
        <div className="grid grid-cols-12 items-start">
          <div className="col-span-12 sm:col-span-4">
            <div className="flex items-center gap-2 mb-3">
              <Image
                src={assets.logo}
                alt="Diblow Logo"
                width={50}
                height={30}
                className="cursor-pointer transition-transform duration-200 hover:scale-105"
              />
              <h4 className="text-lg md:text-base font-futura-heavy cursor-pointer">
                Diblow.com
              </h4>
            </div>
            <p className="mt-2 text-sm md:text-sm">
              Diblow.com là nền tảng mua sắm trực tuyến hàng đầu cung cấp nhiều
              loại sản phẩm với giá cả cạnh tranh.
            </p>
          </div>
          <div className="col-span-12 sm:col-span-4 mt-4 md:mt-0 w-full flex items-center justify-center">
            <div className="flex flex-col justify-between">
              <h4 className="text-lg uppercase mb-3 font-futura-heavy">
                Thông tin liên hệ
              </h4>
              <ul style={{ listStyleType: "initial" }} className="pl-4 mb-2">
                <li className="text-sm leading-7 mb-2">
                  <a className="text-sm leading-7" href="/payment-guide">
                    Hướng dẫn thanh toán
                  </a>
                </li>
                <li className="text-sm leading-7 mb-2">
                  <a className="text-sm leading-7" href="/">
                    Quy định vận chuyển
                  </a>
                </li>
                <li className="text-sm leading-7 mb-2">
                  <a className="text-sm leading-7" href="/return-policy">
                    Chính sách đổi trả
                  </a>
                </li>
                <li className="text-sm leading-7 mb-2">
                  <a className="text-sm leading-7" href="/contact">
                    Tra cứu đơn hàng
                  </a>
                </li>
                <li className="text-sm leading-7 mb-2">
                  <a className="text-sm leading-7" href="/contact">
                    Bảo mật thông tin
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-4">
            <div className="md:flex md:items-center md:justify-center">
              <h4 className="text-sm text-center mb-2 font-futura-heavy">
                Đăng kí nhận thông tin ưu đãi và xu hướng mới nhất
              </h4>
            </div>
            <form
              className="flex flex-col items-end gap-2 mt-4 w-full"
              onSubmit={(e) => {
                e.preventDefault();
                // handle submit here
              }}
            >
              <input
                type="email"
                required
                placeholder="Nhập email để nhận tin mới"
                className="sm:max-w-[250px] md:max-w-[320px] w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <button
                type="submit"
                className="sm:max-w-[250px] md:max-w-[320px] mt-5 w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors text-sm"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2025 © Diblow.com All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;

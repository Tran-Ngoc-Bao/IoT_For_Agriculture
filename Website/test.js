// Tạo dữ liệu cho 10 ngày gần đây, mỗi ngày 24h là 24 dữ liệu.

import express from 'express';
import mongoose from 'mongoose';

// Kết nối tới cơ sở dữ liệu MongoDB
try {
    mongoose.connect('mongodb://localhost:27017/test')
        .then(() => console.log('Database connected!'))
} catch (error) {
    console.log(error);
}
// Định nghĩa Schema
const deviceSchema = new mongoose.Schema({
    address: { type: String },
    data: [
        {
            time: { type: Date, default: Date.now },
            value: { type: Number },
        },
    ],
});

// Tạo mô hình từ Schema
const Device = mongoose.model('Device', deviceSchema);

// Mảng các địa chỉ
const addresses = ['Hà Nội', 'Hòa Bình', 'Sơn La', 'Nam Định', 'Lai Châu'];


// Hàm tạo ngẫu nhiên một số từ min đến max
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  // Hàm tạo ngẫu nhiên một thời gian trong khoảng 30 ngày trước
  function getRandomTime() {
    const currentDate = new Date();
    const randomDays = getRandomNumber(1, 30);
    const timeAgo = new Date(currentDate.getTime() - randomDays * 24 * 60 * 60 * 1000);
    return timeAgo;
  }
  
// Hàm tạo dữ liệu cho một ngày, bao gồm 24 giờ
function generateDataForDay(address, date) {
  const data = [];
  const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  for (let hour = 0; hour < 24; hour++) {
    const time = new Date(startDate.getTime() + hour * 60 * 60 * 1000);
    const value = getRandomNumber(0, 100) / 25;
    data.push({ time, value });
  }
  return data;
}

// Hàm tạo dữ liệu cho 10 ngày gần đây, mỗi ngày có đủ 24 giờ
function generateDataForRecentDays(address) {
  const data = [];
  const currentDate = new Date();
  for (let day = 0; day < 20; day++) {
    const date = new Date(currentDate.getTime() - day * 24 * 60 * 60 * 1000);
    const dayData = generateDataForDay(address, date);
    data.push(...dayData);
  }
  return data;
}

// Hàm tạo dữ liệu cho 10 ngày gần đây, mỗi ngày có đủ 24 giờ cho mỗi địa chỉ và lưu vào cơ sở dữ liệu
async function createRecentDeviceData() {
  for (const address of addresses) {
    const device = new Device({ address, data: generateDataForRecentDays(address) });
    await device.save();
  }
  console.log('Dữ liệu đã được tạo thành công!');
}

// Gọi hàm tạo dữ liệu cho 10 ngày gần đây, mỗi ngày có đủ 24 giờ
createRecentDeviceData();
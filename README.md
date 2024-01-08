# Bài tập lớn IT4735 
## Thành viên nhóm
<table>
  <tr>
    <th>Họ tên</th>
    <th>MSSV</th>
    <th>Nhiệm vụ</th>
  </tr>
<tr>
  <td>Trần Ngọc Bảo (Trưởng nhóm)</td>
  <td>20215529</td>
  <td>Hardware</td>
</tr>
<tr>
  <td>Lý Văn Hiếu</td>
  <td>20204829</td>
  <td>Front-end</td>
</tr>
<tr>
  <td>Hà Duy Long</td>
  <td>20204841</td>
  <td>Back-end</td>
</tr>
<tr>
  <td>Nguyễn Cảnh Chi</td>
  <td>20172973</td>
  <td>Report</td>
</tr>
</table>

## Giới thiệu bài tập lớn
<ul>
  <li>Tên đề tài: <strong>Hệ thống đo mực nước đầu nguồn phục vụ nông nghiệp</strong></li>
  <li>Đo mực nước theo từng khoảng thời gian ở các địa điểm đầu nguồn</li>
  <li>Gửi, biểu diễn dữ liệu trên website để người đăng ký có thể xem</li>
  <li>Gửi email cảnh báo khi có sự bất thường ở đầu nguồn</li>
</ul>

## Cài đặt hệ thống
<ul>
  <li>Các thiết bị cần thiết: <strong>Cáp type C, Dây nối 40P, ESP32, HCSR04</strong></li>
  <li>Những phần mềm ứng dụng cần cài đặt: <strong>Arduino IDE, MongoDB, MQTT explorer, Visual Studio Code</strong></li>
  <li>Cùng với MQTT broker miễn phí được hỗ trợ bởi <strong>HiveMQ Cloud</strong></li>
</ul>

## Hướng dẫn sử dụng 
<ul>
  <li>Lắp ghép mạch, kết nối các thiết bị với nhau</li>
  <li>Clone repository về máy tính cá nhân</li>
  <li>Khởi động MQTT broker free của <strong>HiveMQ Cloud</strong> để chuẩn bị nhận dữ liệu</li>
  <li>Chạy các đoạn code trong Hardware nhờ Arduino IDE để bắt đầu <strong>publish dữ liệu lên MQTT broker</strong></li>
  <li>Tiến hành mở web server bằng <strong>NodeJS</strong> trong Back-end để <strong>subcribe dữ liệu từ MQTT broker</strong></li>
  <li>Lưu dữ liệu nhận được vào <strong>MongoDB</strong>, đồng thời hiển thị Website của hệ thống</li>
  <li>XEM CHI TIẾT TRONG BÁO CÁO BÀI TẬP LỚN</li>
</ul>

## Báo cáo bài tập lớn
<ul>
  <li>Báo cáo</li>
  <li><a href="https://github.com/Tran-Ngoc-Bao/ProjectIOT/blob/main/ProjectReport/slide.pptx">Slides</a></li>
</ul>

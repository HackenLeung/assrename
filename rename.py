import os
import re
import tkinter as tk
from tkinter import filedialog


def get_dir():
    root = tk.Tk()
    root.withdraw()

    # 弹出对话框选择文件夹，默认为当前目录
    catalogue = filedialog.askdirectory(initialdir=os.getcwd())

    if not catalogue:
        print("未选择文件夹，准备退出...")
        return

    try:
        files = os.listdir(catalogue)
        for file in files:
            if file.endswith('.tc.ass') or file.endswith('.TC.ass'):
                file_path = os.path.join(catalogue, file)
                os.remove(file_path)
                print(f"成功删除文件 {file_path}")
            else:
                print(file)

        re_name(catalogue)
    except OSError as e:
        print(f"无法读取目录 {catalogue}：", e)
        print('准备退出...')


def re_name(catalogue):
    root = tk.Tk()
    root.withdraw()

    # 弹出对话框输入新名称
    new_name = tk.simpledialog.askstring("输入新名称", "请输入新名称：")

    if not new_name:
        print("未输入新名称，准备退出...")
        return

    print(f"你输入的名称是： {new_name}")

    try:
        files = os.listdir(catalogue)
        files.sort()
        for index, file in enumerate(files):
            old_path = os.path.join(catalogue, file)

            def replace_episode_number(file_name, new_episode_number):
                regex_array = [r'- (\d+)', r'\[(\d+)\]', r'第(\d+)']
                for regex in regex_array:
                    match = re.search(regex, file_name)
                    if match:
                        episode_number = int(new_episode_number)
                        formatted_episode_number = f"{episode_number:02d}" if episode_number < 10 else f"{episode_number}"
                        return re.sub(match.group(1), formatted_episode_number, file_name)
                return '未找到匹配的剧集编号'

            new_file_name = replace_episode_number(new_name, index + 1)
            if new_file_name == '未找到匹配的剧集编号':
                print(new_file_name, 'new_file_name')
            else:
                new_path = os.path.join(catalogue, new_file_name + '.ass')
                os.rename(old_path, new_path)
                print(f"成功重命名文件 {file} 为 {new_file_name}")

    except OSError as e:
        print(f"无法重命名文件 {file}：", e)

get_dir()

# 已覆盖例子
# [Sakurato.Sub&FS-Raw] Tate no Yuusha no Nariagari - 01 (HEVC-10Bit-2160P AAC)
# [VCB-Studio] Yamada-kun to 7-nin no Majo [01][Ma10p_1080p][x265_flac]
# [Snow-Raws] DARKER THAN BLACK 黒の契約者 第01話 (BD 1920x1080 HEVC-YUV420P10 FLACx2)
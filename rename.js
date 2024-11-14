const readline = require('readline');
const fs = require('fs');
const path = require('path');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question('请输入文件夹： ', (answer) => {
    getDir(answer);
});



function getDir(catalogue) {
    const currentDir = process.cwd();
    const targetDir = path.join(currentDir, catalogue);

    fs.readdir(targetDir, (err, files) => {
        if (err) {
            console.error(`无法读取目录 ${catalogue}：`, err);
            console.log('准备退出...');
            process.exit();
            return;
        }
        // console.log(`目录 ${targetDir} 中的文件列表：`);
        // rl.question(`是否删除？（y/n） `, (answer) => {
        // if (answer.toLowerCase() === 'y') {
        // } else {
        //     console.log(`文件未被删除。`);
        //     rl.close();
        // }
        // });
        files.forEach(file => {
            // console.log(file);
            if (file.endsWith('.tc.ass') || file.endsWith('.TC.ass')) {
                const filePath = path.join(targetDir, file);
                fs.unlink(filePath, err => {
                    if (err) {
                        console.error(`无法删除文件 ${filePath}：`, err);
                    } else {
                        console.log(`成功删除文件 ${filePath}`);
                    }
                });
            } else {
                console.log(file);
            }
        });
        reName(catalogue)
    });
}

function reName(catalogue) {
    const currentDir = process.cwd();
    const targetDir = path.join(currentDir, catalogue);
    rl.question('请输入新名称： ', (answer) => {
        console.log(`你输入的名称是： ${answer}`);

        fs.readdir(targetDir, (err, files) => {
            // 对文件按名称进行排序
            files.sort();
            files.forEach((file, index) => {
                // 重命名文件
                const oldPath = path.join(targetDir, file);
                const replaceEpisodeNumber = (fileName, newEpisodeNumber) => {
                    const regexArray = [/- (\d+)/, /\[(\d+)\]/, /第(\d+)/];
                    for (const regex of regexArray) {
                        const match = fileName.match(regex);
                        if (match) {
                            const episodeNumber = parseInt(newEpisodeNumber);
                            const formattedEpisodeNumber = episodeNumber < 10 ? `0${episodeNumber}` : `${episodeNumber}`;
                            // 只替换匹配项里的集数
                            return fileName.replace(match[1], formattedEpisodeNumber);
                        }
                    }
                    return '未找到匹配的剧集编号';
                };

                const newFileName = replaceEpisodeNumber(answer, index + 1);
                if (newFileName == '未找到匹配的剧集编号') {
                    console.log(newFileName, 'newFileName');
                } else {
                    const newPath = path.join(targetDir, newFileName + '.ass');
                    fs.rename(oldPath, newPath, (err) => {
                        if (err) {
                            console.error(`无法重命名文件 ${file}：`, err);
                        } else {
                            console.log(`成功重命名文件 ${file} 为 ${newFileName}`);
                        }
                    });
                }

            });
        });
        rl.close();
    });


}

// 已覆盖例子
// [Sakurato.Sub&FS-Raw] Tate no Yuusha no Nariagari - 01 (HEVC-10Bit-2160P AAC)
// [VCB-Studio] Yamada-kun to 7-nin no Majo [01][Ma10p_1080p][x265_flac]
// [Snow-Raws] DARKER THAN BLACK 黒の契約者 第01話 (BD 1920x1080 HEVC-YUV420P10 FLACx2)

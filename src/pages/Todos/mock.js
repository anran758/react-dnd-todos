import { generate } from 'shortid';

const DEFAULT_DATA = [
  "001 - 03708 - 中国近现代史纲要",
  "002 - 03709 - 马克思主义基本原理概论",
  "005 - 02197 - 概率论与数理统计(二)",
  "006 - 02324 - 离散数学",
  "007 - 02331 - 数据结构",
  "008 - 04735 - 数据库系统原理",
  "009 - 02325 - 计算机系统结构",
  "010 - 02326 - 操作系统",
  "011 - 04737 - C++程序设计",
  "012 - 04747 - Java语言程序设计(一)",
  "013 - 02333 - 软件工程",
  "014 - 04741 - 计算机网络原理",
  "015 - 11441 - 计算机及应用课程实验(二)",
  "016 - 10203 - 计算机及应用毕业设计",
  "003 - 00015 - 英语(二)",
  "004 - 00023 - 高等数学(工本)",
]

export function generatorMockData() {
  const dataByMapping = {};
  const dataByIds = [];

  DEFAULT_DATA.forEach((str, index, arr) => {
    const key = generate();
    const card = {
      id: key,
      text: str,
      complate: false,
      active: false,
      createdDate: Date.now(),
    };

    if (index < 2) {
      card.active = true;
    } else if (index >= arr.length - 2) {
      card.complate = true;
    }

    dataByMapping[key] = card;
    dataByIds.push(key);
  });

  return {
    dataByIds,
    dataByMapping
  }
}


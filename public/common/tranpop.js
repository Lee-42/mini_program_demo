let tranpop = {};
// function isIn(element) {
// 	const rect = element.getBoundingClientRect()
// 	const { top, bottom } = rect
// 	console.log(top, bottom);
// 	const fheight = document.getElementsByClassName('nt-message-box__content')[0].innerHeight
// 	console.log(fheight);
// 	return (top >= 0 && top <= fheight) || (bottom >= 0 && bottom < fheight)
// }
tranpop.popTable = (tableData, selectedCallback) => {
  // function fn(event) {
  // 	event.stopPropagation()
  // 	event.preventDefault()
  // 	if (event.keyCode == "40") {
  // 		selectPopTableItem(++window.poptableNowIndex);
  // 		document.getElementById(`tr${window.poptableNowIndex}`).scrollIntoView(false)
  // 	}
  // 	if (event.keyCode == "38") {
  // 		selectPopTableItem(--window.poptableNowIndex);
  // 		document.getElementById(`tr${window.poptableNowIndex}`).scrollIntoView(false)
  // 	}
  // 	// 回车执行选中行数据的回调事件
  // 	if (event.keyCode == "13") {
  // 		selectedCallback(datas[window.poptableNowIndex]);
  // 		nt.messageBox.close()
  // 		window.removeEventListener("keydown", fn);
  // 		// console.log(`setTimeout - event.keyCode:`, event.keyCode);
  // 	}
  // }

  let heads = tableData.heads;
  let datas = tableData.datas;
  window.poptableNowIndex = 0;
  window.poptableDataLength = datas.length;
  window.poptableSelectedCallback = selectedCallback;
  let html = ``;
  html += `<table border　style="border:1px solid #eee;" id="poptable">`;

  html += `<tr style="background-color:#98b2d3;">`;
  html += `<td  style="min-width:20px;padding-left:5px;opacity:0"></td>`;
  for (let i = 0; i < heads.length; i++) {
    html += `<td style="min-width:100px;color:#ffffff;padding-left:5px">${heads[i]}</td>`;
  }
  html += `</tr>`;
  for (let i = 0; i < datas.length; i++) {
    html += `<tr class="pop_table_item" id="tr${i}">`;
    html += `<td  style="min-width:20px;padding-left:5px"><input type="checkbox" id="${i}"></td>`;
    for (let j = 0; j < datas[i].length; j++) {
      html += `<td  style="min-width:100px;padding-left:5px">${datas[i][j]}</td>`;
    }
    html += `</tr>`;
  }
  html += `</table>`;
  nt.messageBox({
    title: "请选择",
    showConfirmButton: false,
    // "showCancelButton": false,
    showClose: false,
    dangerouslyUseHTMLString: true,
    "lock-scoll": true,
    beforeClose: (action, instance, done) => {
      console.log(action);
      if (action == "close" || action == "cancel") {
        done();
      }
      if (action == "confirm") {
        // selectedCallback(datas[window.poptableNowIndex]);
        done();
      }
    },
    customStyle: {
      width: "auto",
      maxWidth: "80%",
    },
    message: html,
  });

  function listenCheckBox() {
    // 获取所有的checkbox元素
    const checkboxes = document.querySelectorAll(
      'table input[type="checkbox"]'
    );
    // 为每个checkbox添加聚焦事件监听器
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("focus", function checkFocus() {
        console.log("Checkbox is focused:", this.id);
        selectPopTableItem(this.id);
      });
      checkbox.addEventListener("click", function checkClick() {
        console.log("Checkbox is click:", this.id);
        selectedCallback(datas[this.id]);
        console.log(`checkClick - datas[this.id]:`, datas[this.id]);
        nt.messageBox.close();
      });
    });
  }

  setTimeout(() => {
    // selectPopTableItem(0);
    listenCheckBox();
    // window.addEventListener("keydown", fn)
  }, 500);
};

function selectPopTableItem(index) {
  console.log(index);
  if (index < 0) {
    window.poptableNowIndex = 0;
    return;
  }
  if (index == window.poptableDataLength) {
    window.poptableNowIndex = window.poptableDataLength - 1;
    return;
  }
  let ptiList = document.getElementsByClassName("pop_table_item");
  // console.log(ptiList.length)
  for (let i = 0; i < ptiList.length; i++) {
    if (i == index) {
      ptiList[i].style.backgroundColor = "#5555ff";
      ptiList[i].style.color = "#ffffff";
    } else {
      ptiList[i].style.backgroundColor = "#ffffff";
      ptiList[i].style.color = "#000000";
    }
  }
}

export default tranpop;

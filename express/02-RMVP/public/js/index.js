fetch("http://localhost:3000/list", { method: "GET" })
  .then((res) => {
    return res.json();
  })
  .then((json) => {
    const data = json.data;
    let templateStr = `
    {{each data}}
    	<li>test : 索引{{$index}}. 值{{$value}}</li>
    {{/each}}`;
    const html = template.render(templateStr, { data: data });
    // let html;
    // for (let i = 0; i < data.length; i++) {
    //   html += `<li>test : 索引${i}. 值${data[i]}</li>`;
    // }

    document.getElementById("list").innerHTML = html;
  });

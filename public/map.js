var pos, map, measureTool, geocoder;
var sweden = { lat: 59.334591, lng: 18.06324 };
const menubtn = document.querySelector(".mobile-menu");
const menu = document.querySelector(".menu-mobile");
const divMap = document.getElementById("map");
const calcInputs = document.querySelector(".calc");
const house = document.querySelector('.house')
const yesBtn = document.querySelector('.yes')
const hiddenContent = document.querySelectorAll('.side')
const title = document.querySelector('.title')
const marker = document.querySelector('.marker')
const search = document.querySelector('.search')
const helpBtn = document.querySelector('.help')
const helpContent = document.querySelector('.helpContent')
const acceptHelp = document.querySelector('.accept')
const nextBtn = document.querySelector('.nextBtn')
const form = document.querySelector('form')

menubtn.addEventListener("click", () => {
  menu.classList.toggle("translate-x-full");
});


yesBtn.addEventListener('click', () => {
  hiddenContent.forEach(content => {
    content.classList.remove('hidden')
    content.classList.add('block')
    title.innerHTML = "Markera hela ditt tak"
    marker.classList.remove('hidden')
    helpBtn.textContent ="hittar inte mitt hus"
    marker.classList.add('flex')
    search.classList.remove('flex')
    search.classList.add('hidden')
    yesBtn.classList.add('hidden')
    divMap.classList.remove('h-96')

  })
})
acceptHelp.addEventListener('click', () => {
  hiddenContent.forEach(content => {
    content.classList.add('hidden')
    content.classList.remove('block')
    search.classList.add('flex')
    search.classList.remove('hidden')  
    helpContent.classList.add('hidden')
    helpContent.classList.remove('flex')
    helpBtn.textContent = "NEJ"
    divMap.classList.add('h-96')
    marker.classList.remove('flex')
    yesBtn.classList.remove('hidden')


    marker.classList.add('hidden')
    title.innerHTML = "Är det ditt hus på kartan?"

  })
  
})
helpBtn.addEventListener('click', () => {
  helpContent.classList.remove('hidden')
  helpContent.classList.add('flex')

})





function initMap() {
  calcInputs.classList.add("hidden");
  house.classList.add('hidden')
  console.log('map is ready')
  map = new google.maps.Map(divMap, {
    center: sweden,
    mapTypeId: "satellite",
    zoom: 19,
  });

  geocoder = new google.maps.Geocoder();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      map.setCenter(pos);
    });
  }

  measureTool = new MeasureTool(map, {
    contextMenu: true,
    showSegmentLength: true,
    tooltip: true,
    unit: MeasureTool.UnitTypeId.METRIC,
  });

  measureTool.addListener("measure_end", () => {
    $("#area").val("0");
    $("#solar").val("0");
  });
  measureTool.addListener("measure_change", (e) => {
    if (e.result.area) {
      area = Math.round(e.result.area);
      $("#area").val(area);
      calc();
    }
  });

  $("#address").keypress(function (e) {
    if (e.which == 13) {
      gothere();
      return false;
    }
  });
  $("#area").change(function () {
    calc();
  });

  $("#efficiency").change(function () {
    calc();
  });

  $("#insol").change(function () {
    calc();
  });

  $("#performance").change(function () {
    calc();
  });
}

function gothere() {
  var address = document.getElementById("address").value;
  geocoder.geocode({ address: address }, function (results, status) {
    if (status === "OK") {
      calcInputs.classList.remove("hidden");
      house.classList.remove('hidden')
      map.setCenter(results[0].geometry.location);
    } else {
      alert("Cannot go there because: " + status);
      calcInputs.classList.add("hidden");
    }
  });
}

function measure() {
  measureTool.start();
}

function clearMeasure() {
  measureTool.end();
}

function calc() {
  area = Number($("#area").val());
  efficiency = Number($("#efficiency").val());
  insol = Number($("#insol").val());
  performance = Number($("#performance").val());
  solar = ((area * efficiency * insol * performance * 365) / 1000).toFixed(2);
  $("#solar").val(solar);
}

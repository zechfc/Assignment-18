const getcrafts = async() => {
    try{
        console.log("before fetch ");
        return (await fetch("/api/crafts")).json();
        
    } catch (error){
        console.log("error retrieving data");
        return "";
    }

};

let i =0;
const showcrafts = async() => {
    const craftsJSON = await getcrafts();
    const craftsDiv = document.getElementById("crafts-div")
    craftsDiv.innerHTML = "";

    if(craftsJSON == ""){
        craftsDiv.innerHTML = "sorry no crafts";
        return;
    }

    //now loop through the json
let i=0;
   
    



    const column1 = document.createElement("div");
    const column2 = document.createElement("div");
    const column3 = document.createElement("div");
    const column4 = document.createElement("div");

    craftsDiv.classList.add("row");


    column1.classList.add("column");
    column2.classList.add("column");
    column3.classList.add("column");
    column4.classList.add("column");
    craftsDiv.append(column1);
    craftsDiv.append(column2);
    craftsDiv.append(column3);
    craftsDiv.append(column4);

   

    craftsJSON.forEach((craft)=>{
        

        if(i<7){
            i++;
        
            craftsDiv.append(column1);
            const box = document.createElement("section");
        
        
            const img = document.createElement("img");



            img.src = craft.image;
            column1.append(img);
            img.addEventListener("click", () => {
                pop(craft);
            });
           
        }
    
        else if(i<13){
            i++;

            craftsDiv.append(column2);
            const box = document.createElement("section");
            box.classList.add("hide")
        
            const img2 = document.createElement("img");
            img2.src = craft.image;
            column2.append(img2);
            img2.addEventListener("click", () => {
                pop(craft);
            });
        }
        else if(i <19){
            i++;

            craftsDiv.append(column3);
    
        
        
            const img3 = document.createElement("img");
            img3.src = craft.image;
            column3.append(img3);
            img3.addEventListener("click", () => {
                pop(craft);
            });
        }
        else{
            i++;
        
            craftsDiv.append(column4);
            const box = document.createElement("section");
            
            const img4 = document.createElement("img");
            img4.src = craft.image;
            column4.append(img4);

            img4.addEventListener("click", () => {
                pop(craft);
            });
        
        }


      

       
    
    })
   };
//https://www.w3schools.com/w3css/w3css_modal.asp


const pop = (craft) => {
    openDialog("dialog-content");
    document.getElementById("dialog-img").classList.remove("hidden");
    document.getElementById("dialog-img").classList.add("show");

   

    document.getElementById("dialog").style.display = "block";

    const box = document.getElementById("dialog-content");
    const imgSection = document.getElementById("dialog-img");

    if (box.innerHTML !== null) {
        box.innerHTML = "";
        imgSection.innerHTML = " ";
    }

    const imgpop = document.createElement("img");
    console.log("Image: " + craft.image);
    if(craft.image){
        imgpop.src = craft.image;

    }

    const title = document.createElement("h2");
    title.innerHTML = craft.name;


    const section = document.createElement("section");
    section.classList.add("links")

    const dLink = document.createElement("a");
    dLink.innerHTML = "	&#9249;";
    dLink.id = "delete-link";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    eLink.id = "edit-link";

    const subheader = document.createElement("h3");
    subheader.innerHTML = "Supplies";

    const list = document.createElement("ul");
    craft.supplies.forEach((supplies) => {
        const supplies1 = document.createElement("li");
        supplies1.innerHTML = supplies;
        list.append(supplies1);
    });

    const desc = document.createElement("p");
    desc.innerHTML = craft.description;

    imgSection.append(imgpop);

    box.append(title);
    section.append(dLink);
    section.append(eLink);
    title.append(section);

    box.append(desc);
    box.append(subheader);
    box.append(list);

    eLink.onclick = showCraftForm;
    dLink.onclick = deleteCraft.bind(this, craft);
    

   console.log("this num =" +craft._id);

    populateEditForm(craft);

    
};

const populateEditForm = (craft) => {
    const form = document.getElementById("add-craft-form");

    console.log(document.getElementById("add-craft-form"));
    console.log("test " + craft._id);

    form._id.value = craft._id;
    console.log("form "+form._id.value);

    form.name.value = craft.name;
    form.description.value = craft.description;
    document.getElementById("img-prev").src = craft.image;

    populateSupplies(craft.supplies);

  }

  const populateSupplies = (supplies) => {

    const section = document.getElementById("supply-boxes");
    supplies.forEach((supplies)=>{
      const input = document.createElement("input");
      input.type = "text"
      input.value = supplies;
      section.append(input);
    });
        console.log("finsh");

  }


  const addEditCraft = async (e) => {
    console.log("start edit");

    e.preventDefault();
    const form = document.getElementById("add-craft-form");
    const formData = new FormData(form);
    let response;
    formData.append("supplies", getSupplies());
  
    console.log(...formData);
  
    //add request
    if (form._id.value.trim() == "") {
      console.log("in post");
      response = await fetch("/api/crafts", {
        method: "POST",
        body: formData,
      });
    } else {
      //put request
      console.log("in put");
      response = await fetch(`/api/crafts/${form._id.value}`, {
        method: "PUT",
        body: formData,
      });
    }
  
    //successfully got data from server
    if (response.status != 200) {
      console.log("Error adding / editing data");
    }
  
    await response.json();
    resetForm();
    document.getElementById("dialog").style.display = "none";
    showcrafts();
  };
  
  const deleteCraft = async(craft) => {
    console.log("deleting craft " + craft._id);
    let response = await fetch(`/api/crafts/${craft._id}`,{
      method:"DELETE",
      headers:{
        "Content-Type":"application/json;charset=utf-8"
      }
    });
  
    if(response.status !=200){
      console.log("Error deleting");
      return;
    }
    let result = await response.json();
      resetForm();
      showcrafts();
      document.getElementById("dialog").style.display = "none";
  
  }

    const openDialog = (id) => {
        document.getElementById("dialog").style.display = "block";
        document.querySelectorAll("#dialog-details > *").forEach((item)=> {
            item.classList.add("hidden");
        });
        document.getElementById(id).classList.remove("hidden");
    }

    const showCraftForm = (e) => {
        openDialog("add-craft-form");
        console.log(e.target);
        if (e.target.getAttribute("id") != "edit-link") {
          resetForm();
        }
    }
    
    const addSupply = (e) => {
        e.preventDefault();
        const section = document.getElementById("supply-boxes");
        const input = document.createElement("input");
        input.type = "text";
        input.minLength = 3;
        input.required = true; 

        section.append(input);
        input.classList.add("columns")
        
    }
    
    const resetForm = () => {
        console.log("reset");

        const form = document.getElementById("add-craft-form");
        form.reset();
        document.getElementById("supply-boxes").innerHTML = "";
        console.log("crafts/200x300.gif")
        document.getElementById("img-prev").src="crafts/200x300.gif";
    };
    
    const getSupplies = () => {
        const inputs = document.querySelectorAll("#supply-boxes input");
        const supplies=[];
        console.log(supplies);
        inputs.forEach((input)=>{
            supplies.push(input.value);
            console.log(supplies);

        });
    
        return supplies;
    }
    
    document.getElementById("dialog-close").onclick = () => {
        document.getElementById("dialog").style.display = "none";
    };

    
    showcrafts();
    document.getElementById("add-craft-form").onsubmit = addEditCraft;
    document.getElementById("add-link").onclick = showCraftForm;
    document.getElementById("add-supply").onclick = addSupply;
    document.getElementById("cancel").onclick = () => {
        document.getElementById("dialog").style.display = "none";
    };
    
    document.getElementById("img").onchange = (e) => {
        const prev = document.getElementById("img-prev");
    
        //they didn't pick an image
        if(!e.target.files.length){
            prev.src="crafts/200x300.gif";
            return;
        }
        
        document.getElementById("img-prev").src = URL.createObjectURL(
            e.target.files.item(0)
        );

        // prev.src = URL.createObjectURL(e.target.files.item(0));
    }


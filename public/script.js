const getcrafts = async() => {
    try{
        
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
    document.getElementById("dialog").style.display = "block";

    const box = document.getElementById("dialog-content");
    const imgSection = document.getElementById("dialog-img");

    if (box.innerHTML !== null) {
        box.innerHTML = "";
        imgSection.innerHTML = " ";
    }

    const imgpop = document.createElement("img");
    imgpop.src = craft.image;

    const title = document.createElement("h2");
    title.innerHTML = craft.name;

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
    box.append(desc);
    box.append(subheader);
    box.append(list);
    
};

    



    document.getElementById("dialog-close").onclick = () => {
        document.getElementById("dialog").style.display = "none";
    };

    const openDialog = (id) => {
        document.getElementById("dialog").style.display = "block";
        document.querySelectorAll("#dialog-details > *").forEach((item)=> {
            item.classList.add("hidden");
        });
        document.getElementById(id).classList.remove("hidden");
    }

    const showCraftForm = (e) => {
        e.preventDefault();
        resetForm();
        document.getElementById("img-prev").src="crafts/200x300.gif";

        openDialog("add-craft-form");

    }
    
    const addSupply = (e) => {
        e.preventDefault();
        const section = document.getElementById("supply-boxes");
        const input = document.createElement("input");
        input.type = "text";
        section.append(input);
        input.classList.add("columns")
        
    }
    
    const resetForm = () => {
        const form = document.getElementById("add-craft-form");
        form.reset();
        document.getElementById("supply-boxes").innerHTML = "";
        document.getElementById("img-prev").src="";
    };
    
    const addCraft = async(e)=> {
        e.preventDefault();
        console.log("...formData");

        const form = document.getElementById("add-craft-form");
        const formData = new FormData(form);
        formData.append("supplies", getSupplies());
        console.log(...formData);
    
        const response = await fetch("/api/crafts/", {
            method:"POST",
            body:formData
        });
    
        if(response.status != 200){
            console.log("error posting data");
        }
    
        await response.json();
        resetForm();
        document.getElementById("dialog").style.display = "none";
        showCrafts();
    
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
    
    
    showcrafts();
    document.getElementById("add-craft-form").onsubmit = addCraft;
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
        
    
        prev.src = URL.createObjectURL(e.target.files.item(0));
    }




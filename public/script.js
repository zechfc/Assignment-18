const getcrafts = async() => {
    try{
        console.log("before fetch ");
        return (await fetch("/api/crafts")).json();
        
    } catch (error){
        console.log("error retrieving data");
        return "";
    }

};

const showcrafts = async() => {
    let craftsJSON = await getcrafts();
    console.log("after fetch");
    let craftsDiv = document.getElementById("crafts-div")

    
    
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
    console.log("Image: " + craft.image);
    if(craft.image){
        imgpop.src = craft.image;

    }

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
        input.minLength = 3;
        input.required = true; 

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
    
        const response = await fetch("/api/crafts", {
            method:"POST",
            body:formData
        });
    
        if(response.status != 200){
            console.log("error posting data");
        }
    
        await response.json();
        resetForm();
        document.getElementById("dialog").style.display = "none";
        showcrafts();
    
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




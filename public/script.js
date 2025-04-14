const input = document.getElementById("search");
const suggestionsList = document.getElementById("suggestions");

input.addEventListener("input", async function () {
    const words= this.value.trim().split(/\s+/);
    const query= words[words.length-1];
    if (!query) {
        suggestionsList.innerHTML = "";
        return;
    }

    try {
        const res = await fetch("/autocomplete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query })
        });

        // Check if the response is OK
        if (!res.ok) {
            throw new Error("Network response was not ok");
        }

        const suggestions = await res.json();

        console.log('Suggestions received:', suggestions); // Debugging output

        // Clear previous suggestions
        suggestionsList.innerHTML = "";

        // Add new suggestions
        suggestions.forEach(word => {
            const li = document.createElement("li");
            li.textContent = word;
            li.addEventListener("click", function(){
                let size= input.value.length - query.length;
                input.value= input.value.slice(0, size);
                input.value= input.value.trim() + " " + word;
                suggestionsList.innerHTML= "";
                input.focus();
                input.setSelectionRange(input.value.length, input.value.length);
            });
            suggestionsList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error);
    }
});

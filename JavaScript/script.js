// Retrieve the completed and not completed orders from sessionStorage (if they exist)
let completedOrders = JSON.parse(sessionStorage.getItem('completedOrders')) || [];
let notCompletedOrders = JSON.parse(sessionStorage.getItem('notCompletedOrders')) || [];

async function fetchMealByIngredient() {
    try {
        // Prompt the user for an ingredient
        let ingredient = prompt('Enter an ingredient to search for a meal:');

        // Check if the user canceled the prompt
        if (ingredient === null) {
            return []; // Return an empty array if canceled
        }

        // Convert the user input to lowercase and replace spaces with underscores
        ingredient = ingredient.toLowerCase().replace(/\s+/g, '_');

        // Corrected URL format with "https://" and added user input as a query parameter
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Check if there's an array of meals in the response
        if (data.meals && data.meals.length > 0) {
            // Process the data and build a formatted message
            const mealList = data.meals.map((meal) => meal.strMeal);
            const randomIndex = Math.floor(Math.random() * mealList.length);
            const selectedMeal = mealList[randomIndex];

            // Create an order object with a random completion status
            const completionStatusOptions = ['completed', 'not completed'];
            const randomCompletionStatus = completionStatusOptions[Math.floor(Math.random() * completionStatusOptions.length)];

            const order = {
                description: `Order for ${selectedMeal}`,
                orderNumber: Math.floor(Math.random() * 1000), // Generate a random order number
                completionStatus: randomCompletionStatus, // Set a random completion status
            };

            // Store the order in the appropriate array
            if (order.completionStatus === 'completed') {
                completedOrders.push(order);
            } else {
                notCompletedOrders.push(order);
            }

            // Store the updated arrays in sessionStorage
            sessionStorage.setItem('completedOrders', JSON.stringify(completedOrders));
            sessionStorage.setItem('notCompletedOrders', JSON.stringify(notCompletedOrders));

            alert(`Meals with ${ingredient.replace(/_/g, ' ')}: ${mealList.join(', ')}`);

            // Alert the randomly selected meal
            alert(`Chef's favorite meal: ${selectedMeal}`);

            // Alert the order details
            alert(`Order Details:\nDescription: ${order.description}\nOrder Number: ${order.orderNumber}\nCompletion Status: ${order.completionStatus}`);
        } else {
            // Handle the case where no meals were found
            alert(`There are no meals with the ingredient: ${ingredient.replace(/_/g, ' ')}`);
        }
    } catch (error) {
        // Handle errors
        console.error('An error occurred:', error);
        throw error;
    }
}






function showIncompleteOrders() {
    // Check if there are any incomplete orders
    if (notCompletedOrders.length > 0) {
        // Iterate through the notCompletedOrders array and display each order
        notCompletedOrders.forEach((order, index) => {
            alert(`Incomplete Order ${index + 1}:\nDescription: ${order.description}\nOrder Number: ${order.orderNumber}`);
        });
    } else {
        alert('There are no incomplete orders.');
    }
}



function updateIncompleteOrderStatus() {
    // Prompt the user for the order number
    const orderNumber = parseInt(prompt('Enter the order number to update:'));

    // Check if the input is a valid number
    if (!isNaN(orderNumber)) {
        // Find the order in the notCompletedOrders array by order number
        const orderIndex = notCompletedOrders.findIndex((order) => order.orderNumber === orderNumber);

        if (orderIndex !== -1) {
            // Order found, prompt the user to update the completion status
            const newCompletionStatus = prompt(`Enter the new completion status for Order ${orderNumber} (0 to keep incomplete, "complete" to mark as completed):`);

            if (newCompletionStatus === '0') {
                // Do nothing, order remains incomplete
                alert(`Order ${orderNumber} remains incomplete.`);
            } else if (newCompletionStatus === 'complete') {
                // Remove the order from notCompletedOrders array
                const removedOrder = notCompletedOrders.splice(orderIndex, 1)[0];

                // Update sessionStorage with the modified notCompletedOrders array
                sessionStorage.setItem('notCompletedOrders', JSON.stringify(notCompletedOrders));

                alert(`Order ${orderNumber} has been completed and removed from incomplete orders.`);
            } else {
                alert('Invalid input. Enter "0" to keep incomplete or "complete" to mark as completed.');
            }
        } else {
            alert(`Order with Order Number ${orderNumber} not found in incomplete orders.`);
        }
    } else {
        alert('Invalid order number. Please enter a valid number.');
    }

    updateOrderCompletionStatus()
}
// Initialize the orders object with empty arrays
let orders = {
    completedOrders: [],
    notCompletedOrders: [],
};


// Function to update the completion status of an order
function updateOrderCompletionStatus() {

    if (newCompletionStatus === '0') {
        // Do nothing, order remains incomplete
        alert(`Order ${orderNumber} remains incomplete.`);
    } else if (newCompletionStatus === 'complete') {
        // Move the order from notCompletedOrders to completedOrders
        const completedOrder = notCompletedOrders.splice(orderIndex, 1)[0];
        orders.completedOrders.push(completedOrder);

        // Update sessionStorage with the modified orders object
        sessionStorage.setItem('orders', JSON.stringify(orders));

        alert(`Order ${orderNumber} has been completed and moved to completed orders.`);
    } else {
        alert('Invalid input. Enter "0" to keep incomplete or "complete" to mark as completed.');
    }
}



// Function to show all completed and incomplete orders
function showAllOrders() {
    if (completedOrders.length > 0 || notCompletedOrders.length > 0) {
        const allOrders = {
            completedOrders: completedOrders,
            notCompletedOrders: notCompletedOrders,
        };
        alert('All Orders:\n' + JSON.stringify(allOrders));
    } else {
        alert('There are no orders.');
    }
}




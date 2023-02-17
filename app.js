// Load words from JSON file
fetch('words.json')
	.then(response => response.json())
	.then(words => {
		// Shuffle words array
		words.sort(() => Math.random() - 0.5)

		let currentWordIndex = 0
		let correctAnswers = 0

		// Get DOM elements
		const polishWordElement = document.getElementById('polish-word')
		const englishWordElement = document.getElementById('english-word')
		const submitButton = document.getElementById('submit-button')
		const resultContainer = document.getElementById('result-container')
		const resultMessageElement = document.getElementById('result-message')
		const nextButton = document.getElementById('next-button')

		// Show first word
		showWord()

		// Event listeners
		submitButton.addEventListener('click', checkAnswer)
		englishWordElement.addEventListener('keyup', function (event) {
			if (event.key === 'Enter') {
				event.preventDefault()
				checkAnswer()
			}
		})
		nextButton.addEventListener('click', showWord)

		function showWord() {
			// Hide result container and clear input
			resultContainer.style.display = 'none'
			englishWordElement.value = ''

			// Check if all words have been shown
			if (currentWordIndex === words.length) {
				// Show final message
				polishWordElement.textContent = 'To wszystkie słowa!'
				englishWordElement.style.display = 'none'
				submitButton.style.display = 'none'
				nextButton.style.display = 'none'
				resultMessageElement.textContent = `Masz ${correctAnswers} poprawnych odpowiedzi z puli ${words.length} słów.`
				resultContainer.style.display = 'block'
				return
			}

			// Show next word
			const word = words[currentWordIndex]
			polishWordElement.textContent = word.polish
			englishWordElement.focus()
			currentWordIndex++
		}

		function checkAnswer() {
			const word = words[currentWordIndex - 1]
			const answer = englishWordElement.value.trim()

			if (answer.toLowerCase() === word.english.toLowerCase()) {
				// Correct answer
				resultMessageElement.textContent = 'Dobrze! 😃'
				correctAnswers++
			} else {
				// Incorrect answer
				resultMessageElement.textContent = `Niestety 🙁 prawidłowa odpowiedź to: "${word.english}".`
			}

			// Show result container and focus next button
			resultContainer.style.display = 'block'
			nextButton.focus()
		}
	})
	.catch(error => {
		console.error(error)
		alert('Coś się zepsuło 🙄')
	})

const addWordForm = document.getElementById('addWordForm')

addWordForm.addEventListener('submit', event => {
	event.preventDefault()

	const wordPolish = document.getElementById('wordPolish').value
	const wordEnglish = document.getElementById('wordEnglish').value

	const newWord = {
		polish: wordPolish,
		english: wordEnglish,
	}

	// w tym miejscu można przeprowadzić walidację danych wprowadzonych przez użytkownika

	// wczytanie aktualnej bazy słów z pliku JSON
	fetch('words.json')
		.then(response => response.json())
		.then(data => {
			// dodanie nowego słowa do bazy
			data.words.push(newWord)

			// zapisanie nowej bazy słów do pliku JSON
			const jsonData = JSON.stringify(data)
			fetch('save-words.php', {
				method: 'POST',
				body: jsonData,
				headers: {
					'Content-Type': 'application/json',
				},
			}).then(response => {
				if (response.ok) {
					// informacja o dodaniu nowego słowa
					alert('Słowo dodane do bazy!')
					// wyczyszczenie pól formularza
					addWordForm.reset()
				} else {
					// informacja o błędzie zapisu bazy słów
					alert('Wystąpił błąd podczas zapisywania bazy słów!')
				}
			})
		})
		.catch(error => {
			// informacja o błędzie wczytywania bazy słów
			alert('Wystąpił błąd podczas wczytywania bazy słów!')
		})
})

const { createApp } = Vue;
createApp({
    data() {
        return {
            hero: { life: 100, name: "Zelda", defense: 0 },
            villain: { life: 100, name: "Darkan" },
            actionHistory: [],
            cooldowns: {
                attack: false,
                defense: false,
                usePotion: false,
                flee: false
            },
            timer: 90,
            interval: null,
            villainInterval: null,
            gameEnded: false
        };
    },
    computed: {
        timerDisplay() {
            const minutes = Math.floor(this.timer / 60);
            const seconds = this.timer % 60;
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
    },
    mounted() {
        this.startTimer();
        this.startVillainAttack();
    },
    methods: {
        startTimer() {
            this.interval = setInterval(() => {
                this.timer--;
                if (this.timer <= 0) {
                    clearInterval(this.interval);
                    this.endGame('O tempo acabou! Darkan venceu.');
                }
            }, 1000);
        },
        startVillainAttack() {
            this.villainInterval = setInterval(() => {
                if (!this.gameEnded) {
                    this.performAction('attack', false);
                }
            }, 15000); // Ataque do vilão a cada 15 segundos
        },
        performAction(action, isHero) {
            if (this.cooldowns[action] || this.gameEnded) {
                alert(`Não foi possível realizar a ação: ${action}. Está em cooldown ou o jogo terminou.`);
                return;
            }
            const actor = isHero ? 'Zelda' : 'Darkan';
            this.playSound(action);
            this.recordAction(action, actor); // Adiciona a ação ao histórico

            if (isHero) {
                this.heroAction(action);
                this.setCooldown(action);
                if (action === 'flee') {
                    this.endGame('Zelda fugiu! Darkan venceu.');
                    return;
                }
            } else {
                this.villainAction(action);
            }
        },
        startCooldown(action, duration) {
        this.cooldowns[action] = true;
        setTimeout(() => {
            this.cooldowns[action] = false;
            }, duration);
        },
        attack() {
            if (!this.cooldowns.attack) {
                // Lógica de ataque
                this.performAction('attack', true);
                this.startCooldown('attack', 3000); // 3 segundos
            }
        },
        defend() {
            if (!this.cooldowns.defense) {
                // Lógica de defesa
                this.performAction('defense', true);
                this.startCooldown('defense', 10000); // 10 segundos
            }
        },
        usePotion() {
            if (!this.cooldowns.usePotion) {
                // Lógica de usar poção
                this.performAction('usePotion', true);
                this.startCooldown('usePotion', 15000); // 15 segundos
            }
        },
        playSound(action) {
            const sound = document.getElementById(`${action}-sound`);
            if (sound) {
                sound.play();
            }
        },
        heroAction(action) {
            if (action === 'attack') {
                this.villain.life -= 10;
                if (this.villain.life <= 0) {
                    this.endGame('Zelda venceu! Darkan foi derrotado.');
                }
            }
            if (action === 'defense') {
                this.hero.defense += 10;
            }
            if (action === 'usePotion') {
                if (this.hero.life < 100) {
                    this.hero.life = Math.min(this.hero.life + 10, 100);
                } else {
                    alert('A vida de Zelda já está cheia!');
                }
            }
        },
        villainAction(action) {
            if (action === 'attack') {
                this.hero.life -= 20;
                if (this.hero.life <= 0) {
                    this.endGame('Darkan venceu! Zelda foi derrotada.');
                }
            }
        },
        setCooldown(action) {
            this.cooldowns[action] = true;
            setTimeout(() => {
                this.cooldowns[action] = false;
            }, 1000); 
        },
        recordAction(action, actor) {
            this.actionHistory.push(`${actor} realizou a ação: ${action}`);
            this.$nextTick(() => {
                const history = this.$refs.actionHistory;
                history.scrollTop = history.scrollHeight;
            });
        },
        endGame(message) {
            this.gameEnded = true;
            clearInterval(this.interval);
            clearInterval(this.villainInterval);
            alert(message);
        },
        restartGame() {
            this.hero.life = 100;
            this.villain.life = 100;
            this.actionHistory = [];
            this.cooldowns = {
                attack: false,
                defense: false,
                usePotion: false,
                flee: false
            };
            this.timer = 90;
            this.gameEnded = false;
            this.startTimer();
            this.startVillainAttack();
        }
    }
}).mount('#app');

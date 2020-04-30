import consumer from "../../channels/consumer";

const quizChannel = (quizId, dataReceived) => (
  consumer.subscriptions.create({ channel: "QuizChannel", id: quizId }, {
    connected() {
      // Called when the subscription is ready for use on the server
      console.log('Connected to QuizChannel');
      console.log('Carregando de game_player.js');
      this.install();
    },
    
    disconnected() {
      // Called when the subscription has been terminated by the server
    },

    update_status(status) {
      this.perform("update_user_status", { status });
    },

    install() {
      window.addEventListener("focus", () => this.update_status("online"));
      window.addEventListener("blur", () => this.update_status("away"));
      document.addEventListener("visibilitychange", () => {
        this.update_status(document.visibilityState === "visible" ? "online" : "away")
      });
    },
    
    received(data) {
      // Called when there's incoming data on the websocket for this channel
      console.log('Data received:', data)
      dataReceived(data);
    }
  })
);

export default quizChannel;

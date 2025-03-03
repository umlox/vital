mod commands;

use commands::ping::*;
use serenity::async_trait;
use serenity::prelude::*;
use serenity::framework::standard::macros::group;
use serenity::framework::standard::StandardFramework;
use commands::repo::*;

#[group]
#[commands(ping, repo)]
struct General;

struct Handler;

#[async_trait]
impl EventHandler for Handler {}

#[tokio::main]
async fn main() {
    let token = "MTMzMzQ0OTcwMzE2NTAwNTg0NQ.GHwL6S.9Y-pZzyKAMyOcSMbY6RtYcC6Vic0U0x1et1OIc";
    
    let framework = StandardFramework::new()
        .configure(|c| c.prefix("."))
        .group(&GENERAL_GROUP);

    let intents = GatewayIntents::GUILD_MESSAGES
        | GatewayIntents::DIRECT_MESSAGES
        | GatewayIntents::MESSAGE_CONTENT;

    let mut client = Client::builder(&token, intents)
        .event_handler(Handler)
        .framework(framework)
        .await
        .expect("Error creating client");

    if let Err(why) = client.start().await {
        println!("Client error: {:?}", why);
    }
}

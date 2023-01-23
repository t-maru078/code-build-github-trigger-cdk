# code-build-github-trigger-cdk

このリポジトリは CloudFormation で定義した下記の処理を CDK で実装した場合のサンプルです。

https://github.com/t-maru078/code-build-github-trigger

処理内容は CloudFormation を使っていた場合と変わらず CodeBuild と GitHub を Webhook で連携し、GitHub 側で発生する Event をトリガーにして CodeBuild を起動するサンプルです。

## AWS へのデプロイ

事前に下記の作業が必要です。

1. AWS CLI のインストールと、認証情報、使用するリージョンなどの設定

    https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/getting_started.html#getting_started_prerequisites

1. CDK CLI のインストール

    https://docs.aws.amazon.com/ja_jp/cdk/v2/guide/getting_started.html#getting_started_install

1. GitHub にて Personal access token を取得する。詳細は下記の公式ドキュメント参照。

    https://docs.aws.amazon.com/ja_jp/codebuild/latest/userguide/access-tokens.html

1. CodeBuild と GitHub を接続するために以下のいずれかの方法で、上記手順で取得した GitHub の Personal access token を AWS に設定する。

    1. AWS Management Console で設定

        1. CodeBuild の console を開き Create build project ボタンを押す
        1. Source provider のドロップダウンから GitHub を選択する
        1. Connect with a GitHub personal access token を選択し、GitHub personal access token の欄に GitHub から取得した Personal access token を入力し Save token ボタンを押す
        1. console 最下部の cancel ボタンを押して Create build project のウィザードを閉じる

    1. AWS CLI で設定

        1. 以下のコマンドを使って設定

            ```
            aws codebuild import-source-credentials --server-type GITHUB --auth-type PERSONAL_ACCESS_TOKEN --token <token_value>
            ```

            参照元: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_codebuild-readme.html#githubsource-and-githubenterprisesource


デプロイについても以下のいずれかの方法で実施可能です。

- CDK CLI を使ってデプロイ

  ```
  cdk deploy --parameters githubOwnerName=<GitHub のオーナー名> --parameters githubRepoName=<GitHub リポジトリ名>
  ```



- script を使ってデプロイ

  1. `scripts/env.template` をコピーして `scripts/.env` ファイルを作成し、必要なパラメータを記載する

      | Parameter name | Description | Required |
      |--|--|--|
      | GITHUB_OWNER_NAME | GitHub のオーナー名 or Organization 名 | Yes |
      | GITHUB_REPO_NAME | GitHub リポジトリ名 | Yes |

  1. 上記の手順が完了後、この README と同じディレクトリ階層で下記コマンドを実行することで必要な環境が AWS 上にデプロイされます。

      ```
      bash scripts/deploy-pipeline.sh
      ```


いずれの場合もコマンド実行時に、`cdk bootstrap` が必要という内容のエラーが出た場合は、`cdk bootstrap` を実行後に再度上記コマンドを実行。


## デプロイしたリソースの削除

以下のコマンドを使用するか、AWS Management Console で CloudFormation のページを開き、該当 stack を削除することでも対応可能です。

```
cdk destroy
```

<!DOCTYPE html>
<html lang="ko">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="./css/main2.css">
  <link rel="stylesheet" href="./css/user_information4.css">
  <link rel="stylesheet" href="./css/board2.css">

  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@900&family=Source+Sans+Pro:wght@200&display=swap" rel="stylesheet">
  <title>유저 정보 입력 페이지</title>
  <script src="https://kit.fontawesome.com/e8028249b4.js" crossorigin="anonymous"></script>
</head>

<?php
session_start();

if (isset($_SESSION['id'])) { //로그인O
  $login_bool = 1;
} else { //로그인X
  $login_bool = 0;
}
?>

<body>
  <?php include "./main_title/title.php" ?>
  <?php
  session_start();
  $id = $_SESSION['id']; // 현재 로그인되어 있는 아이디
  $conn = mysqli_connect('localhost', 'kyk', '3909', 'plant_db');
  $sql = "SELECT * FROM users WHERE u_id = '{$id}' ";
  $result = mysqli_query($conn, $sql);

  $row = mysqli_fetch_array($result);
  ?>

  <div id="total_div">
    <div id="user_div">
      <h1>현재 유저 정보</h1>
      <table id="user_table">
        <tr>
          <td>
            <p id="user_profile">유저의 프로필 사진</p>
            <image id="profile" src="./profile/<?= $row['profile'] ? $row['profile'] : "other.JPG" ?>"> <!-- 현재 로그인되어 있는 아이디의 프로필 사진 설정 -->
          </td>
        </tr>
        <tr>
          <td id="user_nickname">유저의 닉네임: <?= $row['nickname'] ?></td> <!-- 현재 로그인되어 있는 아이디의 닉네임 -->
        </tr>
        <tr>
          <td><input id="info_revise_btn" type="button" value="내 정보 수정하기"></td> <!-- 내 정보 수정하기 버튼 -->
        </tr>
        <tr>
          <td><input id="logout_btn" type="button" value="로그아웃"></td> <!-- 로그아웃 버튼 -->
        </tr>
      </table>
    </div>

    <div id="main_div">

      <div class="content_list_div">
        <p class="tmp_title">유저가 쓴 글</p>
        <div class="test">
          <table id="content_list">
            <thead>
              <!-- 게시글의 상단 부분 -->
              <tr>
                <th class="num">번호</th>
                <th class="content_title">제목</th>
                <th class="writer">작성자</th>
                <th class="date">날짜</th>
                <th class="click_count">조회수</th>
              </tr>
            </thead>
            <tbody>
              <!-- user_information.php에서 include했다는 것을 알려주기 위한 변수 -->
              <?php $what_php = "user_information" ?>
              <?php include "./paging/paging.php" ?>

              <?php
              while ($row = mysqli_fetch_array($result)) {
              ?>
                <?php
                // 현재 로그인되어 있는 아이디의 값들 확인하기
                $sql2 = "SELECT * FROM users WHERE u_id = '{$id}' ";
                $result2 = mysqli_query($conn, $sql2);
                $profile_row = mysqli_fetch_array($result2);
                ?>
                <tr class="content_list">
                  <td class="num"><?= $row['num'] ?></td> <!-- 번호 -->
                  <td class="content_title"><a href='read.php?num=<?= $row['num'] ?>'><?= $row['title'] ?></a></td> <!-- 제목 -->
                  <td class="writer"> <!-- 작성자: 프로필사진/닉네임 -->
                    <image id="contents_profile" src="./profile/<?= $profile_row['profile'] ? $profile_row['profile'] : 'other.JPG' ?>"><?= $row['writer'] ?> 
                  </td>
                  <td class="date"><?= $row['date'] ?></td> <!-- 날짜 -->
                  <td class="click_count"><?= $row['click_count'] ?></td> <!-- 조회수 -->
                </tr>
              <?php
                /* paging */
                $cnt++;
              }; ?>
            </tbody>
          </table>


          <div class="pager"> <!-- 페이지 출력 -->
            <?php include "./paging/user_information_page.php" ?>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script type="module" src="./js/index.js"></script>
  <script type="module" src="./js/login.js"></script>
  <script type="module" src="./js/user_information3.js"></script>
  <script>
    const my_info = document.getElementById("my_info");
    const logout_btn = document.getElementById("logout_btn");

    var login_bool = <?php echo $login_bool; ?>;

    my_info.addEventListener("click", function() {
      if (login_bool == 1) { //로그인o
        location.href = 'user_information.php'
      } else { //로그인x
        alert("로그인을 먼저 해주세요");
        location.href = 'login2.php'
      }
    });

    logout_btn.addEventListener("click", function() {
      location.href = 'logout.php'
    });
  </script>
</body>

</html>
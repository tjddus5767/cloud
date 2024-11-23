# 1. Base Image 선택: Node.js LTS 버전 사용
FROM node:18

# MySQL 클라이언트를 설치
RUN apt-get update && apt-get install -y default-mysql-client
# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 종속성 설치를 위해 package.json과 package-lock.json 복사
COPY package*.json ./

# 4. 종속성 설치 (프로덕션 환경에서는 devDependencies는 제외)
RUN npm install --only=production

# 5. 애플리케이션 파일 복사
COPY . .

# 6. 애플리케이션 실행 포트 (Docker 컨테이너 외부에서 접근할 포트 설정)
EXPOSE 3000
RUN npm rebuild bcrypt --build-from-source

# 앱 실행
CMD ["npm", "start"]

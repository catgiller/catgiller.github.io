---
slug: nfs-network-file-system
title: NFS: Ağ Dosya Sistemi
category: Linux
date: October 10, 2026
readTime: 12 min read
excerpt: Başka bir makinenin diskindeki klasörü, kendi makinenizdeymiş gibi kullanmak. Sun 1980'lerde bu problemi çözdü, biz de bugün çözüyoruz.
---

## NFS Nedir?

Hiç bir sunucudaki dosyaya, sanki kendi diskinizdeymiş gibi erişmek istediniz mi? İşte NFS tam olarak bunu yapıyor.

Ağ Dosya Sistemi (NFS), istemcinin dosyalara ağ üzerinden, yerel bir klasörmüş gibi erişmesini sağlayan dağıtılmış bir dosya sistemi. Mantığı bir cümleyle özetlemek gerekirse:

> Başka bir bilgisayarın diskindeki klasörü, kendi bilgisayarımda bir klasör gibi kullanmak.

Sunucuda `/home/erva/share/` adında bir klasör olsun. Bu klasör fiziksel olarak sunucunun diskinde durur — sizin makinenizde değil. Sunucu bu klasörü NFS üzerinden export eder, yani ağdaki istemcilere açar. İstemciler de bu klasöre kendi dosyalarıymış gibi ulaşır. Kopyalama yok, `scp` yok, sadece şeffaf bir bağlantı.

## Nasıl Ortaya Çıktı?

Hikâye 1980'lerin başında, Sun Microsystems'te başlıyor. O dönem Sun'ın parlayan fikri **networked workstation**'dı: her çalışanın kendi workstation'ı vardı. Harika bir fikir, ama bir sorunu vardı — her makineye ayrı disk koyarsan dosyalar makinelerin içine dağılır.

Elinizde on tane makine varsa, bir dosyaya ulaşmak için ya her makineye kopyalamanız ya da dosyanın bulunduğu makineye login olmanız gerekiyordu. Berbat bir deneyim.

Sun'un çözümü: uzak dosya sistemini, yerel dosya sistemi gibi kullanmak. Projenin adı bile kampüsün Stanford Üniversitesi Ağı'nın baş harflerinden geliyor — **SUN**.

## Sürümler: Kısa Bir Yolculuk

İlk sürüm NFSv1 hiç yayınlanmadı; Sun içinde deneysel olarak kullanıldı. Dış dünyaya çıkan ilk sürüm NFSv2 oldu. Oradan bugüne gelen yolculuk şöyle:

| Sürüm | Ne getirdi? |
| --- | --- |
| NFSv2 | İlk yaygın kullanım, stateless yapı, yalnızca UDP |
| NFSv3 | 64-bit dosya boyutu, TCP desteği, daha büyük dosyalar |
| NFSv4 | Mimari değişim, stateful yapı, güvenlik |
| NFSv4.1 / v4.2 | pNFS gibi geliştirmeler |

Birkaç önemli detay:

- **NFSv2** (1989, RFC 1094) yalnızca UDP üzerinden çalışıyordu ve sunucuyu stateless tutmak tasarımın kalbindeydi. 32-bit offset kullandığı için 2 GB üzerindeki dosyalarda takılıyordu.
- **NFSv3** (1995, RFC 1813) 64-bit desteği, güvenli asynchronous write ve `READDIRPLUS` ile geldi. 8 KB aktarım sınırı da kalktı.
- **NFSv4** büyük bir mimari sıçramaydı: dosya kilitleme protokole dahil oldu, `rpcbind` gibi yardımcı servisler gereksiz hale geldi ve TCP temel taşıma yöntemi oldu.

Kısacası: v2 ile başladık, v3 ile olgunlaştı, v4 ile yeniden yazıldı.

## Nasıl Kurulur?

Kurulum şaşırtıcı derecede basit. Sunucu tarafında çekirdek NFS sunucusunu kurun:

```bash
sudo apt install nfs-kernel-server
```

Sonra üç adım kalıyor:

1. Hangi dizinin paylaşılacağı belirlenir.
2. `/etc/exports` üzerinden erişim kuralları yazılır.
3. İstemci, sunucuyla aynı ağda (LAN, VPN, WiFi) olmalıdır — yoksa bağlantı kurulamaz.

## Paylaşım Ayarı: /etc/exports

`/etc/exports`, sunucunun hangi dizini, hangi istemciye, hangi kurallarla açacağını anlatan tek dosya. Sorduğu soru çok basit:

> Benim sunucumda hangi klasör, hangi istemciye, hangi kurallarla açılacak?

```conf — /etc/exports
/home/kali/nfs-share 192.168.1.31 (rw,sync)
```

Bu satır üç parçadan oluşuyor:

| Parça | Anlamı |
| --- | --- |
| `/home/kali/nfs-share` | Export edilen dizin |
| `192.168.1.31` | Erişebilecek istemci |
| `(rw,sync)` | Kurallar |

### Export Seçenekleri

Parantezin içindeki kurallar, paylaşımın davranışını belirler. Sık kullanılanlar:

- `rw` / `ro` — Okuma-yazma / sadece okuma
- `sync` / `async` — Yazmada senkron davran / performans için erken onayla
- `root_squash` — İstemcideki root'u sunucuda ayrıcalıklı sayma (varsayılan, güvenli)
- `no_root_squash` — İstemcideki root'a root yetkisi ver (dikkatli ol)
- `all_squash` — Tüm kullanıcıları anonim kullanıcıya eşle
- `no_subtree_check` — Alt dizin kontrolünü kapat; günümüzde genelde tercih edilir

## Mount Nedir?

Mount, başka bir dosya sistemini kendi makinenizdeki bir dizinin arkasına bağlamaktır.

```bash
sudo mount 192.168.1.31:/home/kali/nfs-share /mnt/nfs
```

Bu komutla `/mnt/nfs` klasörü, sunucudaki `/home/kali/nfs-share` dizinine bir pencere haline gelir. `cat /mnt/nfs/hello.txt` yazdığınızda Linux dosyanın aslında sunucuda olduğunu bilir ve gerekeni yapar — dosya kopyalanmaz, sadece uzak dosya sistemine bir bağlantı kurulur.

| Parça | Görevi |
| --- | --- |
| `mount` | Bağlama işlemini başlatır |
| `192.168.1.31` | NFS sunucusunun IP adresi |
| `/home/kali/nfs-share` | Sunucuda export edilen dizin |
| `/mnt/nfs` | İstemcideki mount point |

## Bağlantıyı Doğrulama

Mount ettikten sonra gerçekten çalıştığını görmek istersiniz:

```bash
$ findmnt /mnt/nfs
TARGET     SOURCE                             FSTYPE  OPTIONS
/mnt/nfs   192.168.1.145:/home/kali/nfs-share  nfs4    rw,relatime,vers=4.2,rsize=1048576,wsize=1048576,namlen=255,hard
```

```bash
$ sudo ls -la /mnt/nfs
total 8
drwxrwxr-x 2 erva 1003 4096 Sep 24 14:18 .
drwxr-xr-x 3 root root 4096 Sep 24 20:21 ..
-rw-rw-r-- 1 erva 1003    0 Sep 24 14:18 hello.txt
```

Çıktıdaki ipuçları: `FSTYPE` alanındaki `nfs4` ve `vers=4.2` bize NFSv4 kullanıldığını, `rw` ise client'ın (izinler uygunsa) yazabildiğini söylüyor.

## UID / GID: İşlerin Karıştığı Yer

Linux'ta dosya izinleri kullanıcı adına değil, **UID / GID**'ye bakar. Kullanıcı adları sadece insanlar için birer kolaylık — asıl kimlik bu sayılardır.

Şu senaryoyu düşünün:

| Taraf | Kullanıcı | Kimlik |
| --- | --- | --- |
| İstemci | `catgiller` | UID 1001 · GID 1001 |
| Sunucu | `kali` | UID 1000 · GID 1003 |

Sunucudaki dosya şöyle olsun: owner UID = 1000, group GID = 1003, izinler `rwxrwxr-x`.

Linux izinleri üç kategoride **sırayla** kontrol eder ve **ilk eşleşmede durur** — izinleri toplamaz:

1. **Owner:** İstemci UID `1001` = dosya UID `1000` mü? Hayır → gruba geç.
2. **Group:** İstemcinin gruplarında GID `1003` var mı? Hayır → others'a geç.
3. **Others:** Kalan izin `r-x` → içinde `w` yok → **yazamaz**.

Sonuç: yazma izni yok. UID/GID'ler iki tarafta da farklı olduğu için kullanıcı "others" iznine düşer. NFS'te en çok kafayı karıştıran şeylerden biri budur.

## Bir Dosya Okuması Nelerden Geçiyor?

`cat /mnt/nfs/hello.txt` yazdığınızda arka planda şu zincir işler:

1. **Kullanıcı** — `cat /mnt/nfs/hello.txt`; uzak dosya yerelmiş gibi okunur.
2. **VFS** — Linux'un soyut dosya katmanı; çağrıyı doğru dosya sistemine yönlendirir.
3. **NFS client** — İsteği NFS protokolüne çevirir.
4. **RPC / network** — İsteği ağ üzerinden (RPC + TCP/UDP) sunucuya taşır.
5. **nfsd** — Sunucudaki NFS daemon'ı; gelen isteği karşılar.
6. **Server VFS** — İsteği gerçek dosya sistemine iletir.
7. **`/home/kali/nfs-share`** — Dosyanın fiziksel olarak bulunduğu yer.
8. **disk** — Verinin kalıcı olarak saklandığı depolama.

### Zincirdeki Oyuncular

**VFS (Virtual File System)** — Linux'un uygulamalarla farklı dosya sistemleri arasındaki ortak arayüzü. `cat` dosyanın NFS'te olduğunu bilmek zorunda değildir; VFS bakar ve "bu NFS üzerinde, NFS client'a gönder" der.

**NFS Client** — VFS'den gelen "hello.txt'yi oku" isteğini, sunucuya gidebilecek bir NFS isteğine dönüştürür.

**RPC (Remote Procedure Call)** — Bir makinenin, başka bir makinedeki işlevi sanki kendi içinde çağırıyormuş gibi çalıştırmasını sağlayan mekanizma. Önemli ayrım: **RPC, NFS değildir** — NFS, uzak dosya işlemlerini taşımak için RPC'yi kullanır.

**nfsd** — Sunucu tarafındaki NFS servisi; istemciden gelen isteği karşılar ve dosya sistemine erişimi sağlar.

**Server VFS** — nfsd'den gelen isteği Linux'un yerel dosya sistemine (ext4 gibi) yönlendirir.

## RPC Nasıl Çalışır?

RPC'nin püf noktası, programcıya işin uzakta yapıldığını hiç hissettirmemesidir. Normal bir fonksiyon çağrısı aynı makinede çalışır; RPC'de ise çağrı ağın karşısındaki makinede çalışır.

1. İstemci isteği yerel bir fonksiyon çağrısı gibi yapar.
2. RPC, isteği ağda taşınabilir bir formata (XDR) dönüştürür.
3. İstek UDP veya TCP ile sunucuya ulaşır.
4. Sunucu isteği çalıştırır, sonucu aynı yoldan geri gönderir.

Taşıma katmanı hikâyesi de NFS sürümleriyle paralel ilerler: NFSv2 UDP ile başladı, TCP NFSv3'te desteklendi, NFSv4'te temel yöntem haline geldi.

## Özet

NFS'in kalbi tek bir fikirde yatıyor: **dosya nerede durursa dursun, erişim yerel gibi hissettirmeli.** Sun bunu 1980'lerde çözdü; o günden beri `/etc/exports`, `mount` ve UID/GID'lerle geçen aynı oyunu oynuyoruz. Aradaki fark, artık neden yazamadığınızı biliyor olmanız.

## Referanslar

- [Oracle — Network File System](https://docs.oracle.com/en/cloud/paas/app-container-cloud/dvcjv/network-file-system.html)
- [SciSpace — The Sun Workstation Architecture](https://scispace.com/pdf/the-sun-workstation-architecture-3xylc87vfv.pdf)
- [Wikipedia — SUN Workstation](https://en.wikipedia.org/wiki/SUN_workstation)
- [Wikipedia — Network File System](https://en.wikipedia.org/wiki/Network_File_System)
- [Oracle — NFS Documentation](https://docs.oracle.com/cd/E19253-01/816-4555/6maoqui94/index.html)
- [Oracle Linux — NFS Versions Concept](https://docs.oracle.com/en/operating-systems/oracle-linux/8/nfs/nfs-versions_concept.html)
- [Kali — nfs-utils](https://www.kali.org/tools/nfs-utils/)
- [Red Hat — NFS Server Configuration: /etc/exports](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/5/html/deployment_guide/s1-nfs-server-config-exports)

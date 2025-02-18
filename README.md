
Postgresql tablo oluşturma komutu :

CREATE TABLE IF NOT EXISTS public.account_info
(
    id integer NOT NULL,
    hesap_kodu character varying(20) COLLATE pg_catalog."default",
    hesap_adi character varying(500) COLLATE pg_catalog."default",
    tipi character(1) COLLATE pg_catalog."default",
    ust_hesap_id integer,
    borc numeric,
    alacak text COLLATE pg_catalog."default",
    borc_sistem text COLLATE pg_catalog."default",
    alacak_sistem text COLLATE pg_catalog."default",
    borc_doviz text COLLATE pg_catalog."default",
    alacak_doviz text COLLATE pg_catalog."default",
    borc_islem_doviz text COLLATE pg_catalog."default",
    alacak_islem_doviz text COLLATE pg_catalog."default",
    birim_adi text COLLATE pg_catalog."default",
    bakiye_sekli integer,
    aktif integer,
    dovizkod integer,
    CONSTRAINT account_info_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.account_info
    OWNER to postgres;

----------------------------------------------------------------------

Database bağlanma bilgileri:
user: 'postgres',
host: 'localhost',
database: 'Rahat-aktarim-api-db',
password: '1234',
port: 5432,
